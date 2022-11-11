const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { redisClient } = require("../redis");
const { sequelize, User, CalendarMember, ProfileImage } = require("../models");
const axios = require("axios");
dotenv.config();

const BASIC_IMG_SRC =
  "https://baeminback.s3.ap-northeast-2.amazonaws.com/basicProfile.png";

//req.flash를 통해 값을 전달해 줄 수 있다.
module.exports = () => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: `${process.env.KAKAO_REST_API}`, // 카카오 로그인에서 발급받은 REST API 키
        callbackURL: "http://www.groupcalendars.shop/api/auth/kakao/callback", // 카카오 로그인 Redirect URI 경로
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
            include: [
              {
                model: ProfileImage,
                attributes: {
                  exclude: ["id", "UserId"],
                },
              },
            ],
          });

          console.log(exUser);
          // 이미 가입된 카카오 프로필이면 성공
          if (exUser) {
            //여기서 req 객체 추가?
            const accessToken = jwt.sign({ id: exUser.id }, "jwt-secret-key", {
              algorithm: "HS256",
              expiresIn: "1d",
            });
            const refreshToken = jwt.sign({ id: exUser.id }, "jwt-secret-key", {
              algorithm: "HS256",
              expiresIn: "14d",
            });

            console.log("exUser.ProfileImages:", exUser.ProfileImages);
            console.log("exUser.ProfileImages.src:", exUser.ProfileImages.src);

            var user = {
              id: exUser.id,
              email: profile._json.kakao_account.email,
              nickname: profile.username,
              ProfileImages: exUser.ProfileImages[0].src,
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
              // 개인 캘린더 지급
              const myCalendar = await newUser.createCalendar(
                {
                  name: newUser.nickname,
                  color: "#dddddd",
                  private: true,
                },
                { transaction: t }
              );

              await CalendarMember.create(
                {
                  UserId: newUser.id,
                  CalendarId: myCalendar.id,
                  authority: 3,
                },
                { transaction: t }
              );

              // 기본 이미지 지급
              const profileImage = await ProfileImage.create(
                {
                  src: BASIC_IMG_SRC,
                },
                {
                  transaction: t,
                }
              );
              await newUser.addProfileImage(profileImage, { transaction: t });

              // 토큰 지급
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
                ProfileImages: BASIC_IMG_SRC,
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
