const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { redisClient } = require("../redis");
const { sequelize, User, CalendarMember, ProfileImage } = require("../models");
dotenv.config();

const BASIC_IMG_SRC =
  "https://baeminback.s3.ap-northeast-2.amazonaws.com/basicProfile.png";

module.exports = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: `${process.env.GOOGLE_CLIENT_ID}`, // 카카오 로그인에서 발급받은 REST API 키
        clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
        callbackURL: "http://www.groupcalendars.shop/api/auth/google/callback", // 카카오 로그인 Redirect URI 경로
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const exUser = await User.findOne({
            where: { snsId: profile.id, provider: "google" },
            include: [
              {
                model: ProfileImage,
                attributes: {
                  exclude: ["id", "UserId"],
                },
              },
            ],
          });

          if (exUser) {
            const accessToken = jwt.sign({ id: exUser.id }, "jwt-secret-key", {
              algorithm: "HS256",
              expiresIn: "1d",
            });
            const refreshToken = jwt.sign({ id: exUser.id }, "jwt-secret-key", {
              algorithm: "HS256",
              expiresIn: "14d",
            });
            var user = {
              id: exUser.id,
              email: profile?.emails[0].value,
              nickname: profile.displayName,
              ProfileImages: exUser.ProfileImages[0].src,
              checkedCalendar: exUser.checkedCalendar,
              accessToken: accessToken,
              refreshToken: refreshToken,
            };

            await redisClient.set(`${exUser.id}`, refreshToken);
            done(null, user);
          } else {
            await sequelize.transaction(async (t) => {
              const newUser = await User.create({
                email: profile?.emails[0].value,
                nickname: profile.displayName,
                snsId: profile.id,
                provider: "google",
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
              var user = {
                id: newUser.id,
                email: profile?.emails[0].value,
                nickname: profile.displayName,
                ProfileImages: BASIC_IMG_SRC,
                checkedCalendar: newUser.checkedCalendar,
                accessToken: accessToken,
                refreshToken: refreshToken,
              };

              await redisClient.set(`${newUser.id}`, refreshToken);
              // 프로필 사진까지 저장
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
