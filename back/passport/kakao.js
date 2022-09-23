const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { redisClient } = require("../redis");
const { sequelize, User } = require("../models");
const axios = require("axios");
dotenv.config();

//req.flash를 통해 값을 전달해 줄 수 있다.
module.exports = () => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: `${process.env.KAKAO_REST_API}`, // 카카오 로그인에서 발급받은 REST API 키
        callbackURL: "http://158.247.214.79/api/auth/kakao/callback", // 카카오 로그인 Redirect URI 경로
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const response = await axios({
            url: `https://kapi.kakao.com/v2/user/scopes?target_id_type=user_id&target_id=${profile.id}`, //refreshToken 토큰 요청하는 API주소
            method: "GET",
            headers: {
              Authorization: `KakaoAK ${process.env.KAKAO_APP_ADMIN_KEY}`,
            },
          });

          if (response.data.scopes[2].agreed !== true) {
            const result = await axios({
              url: `https://kapi.kakao.com/v1/user/unlink?target_id_type=user_id&target_id=${profile.id}`, //refreshToken 토큰 요청하는 API주소
              method: "GET",
              headers: {
                Authorization: `KakaoAK ${process.env.KAKAO_APP_ADMIN_KEY}`,
              },
            });

            if (result) {
              var mesaage = { agreed: false };
              return done(null, false, mesaage);
            }
          }

          const exUser = await User.findOne({
            where: { snsId: profile.id, provider: "kakao" },
          });
          // 이미 가입된 카카오 프로필이면 성공
          if (exUser) {
            //여기서 req 객체 추가?
            const accessToken = jwt.sign({ id: exUser.id }, "jwt-secret-key", {
              algorithm: "HS256",
              expiresIn: "20s",
            });
            const refreshToken = jwt.sign({ id: exUser.id }, "jwt-secret-key", {
              algorithm: "HS256",
              expiresIn: "14d",
            });

            var user = {
              id: exUser.id,
              email: profile._json.kakao_account.email,
              nickname: profile.username,
              ProfileImages: profile._json.properties.profile_image,
              checkedCalendar: exUser.checkedCalendar,
              accessToken: accessToken,
              refreshToken: refreshToken,
            };

            await redisClient.set(`${exUser.id}`, refreshToken);
            done(null, user); // 로그인 인증 완료
          } else {
            // 가입되지 않는 유저면 회원가입 시키고 로그인을 시킨다

            await sequelize.transaction(async (t) => {
              const newUser = await User.create({
                email: profile._json.kakao_account.email,
                nickname: profile.username,
                snsId: `${profile.id}`,
                provider: "kakao",
                checkedCalendar: "",
              });

              await newUser.createPrivateCalendar({
                name: newUser.nickname,
              });

              const accessToken = jwt.sign(
                { id: newUser.id },
                "jwt-secret-key",
                {
                  algorithm: "HS256",
                  expiresIn: "1d",
                }
              );
              const refreshToken = jwt.sign(
                { id: newUser.id },
                "jwt-secret-key",
                {
                  algorithm: "HS256",
                  expiresIn: "14d",
                }
              );

              // 이메일 동의 안하면 다시 reset해주기
              var user = {
                id: newUser.id,
                email: profile._json.kakao_account.email,
                nickname: profile.username,
                ProfileImages: profile._json.properties.profile_image,
                checkedCalendar: newUser.checkedCalendar,
                accessToken: accessToken,
                refreshToken: refreshToken,
              };

              await redisClient.set(`${newUser.id}`, refreshToken);
              done(null, user); // 회원가입하고 로그인 인증 완료
            });
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
