const passport = require("passport");
const {
  Strategy: NaverStrategy,
  Profile: NaverProfile,
} = require("passport-naver-v2");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { redisClient } = require("../redis");
const { sequelize, User, CalendarMember, ProfileImage } = require("../models");
dotenv.config();

const BASIC_IMG_SRC =
  "https://baeminback.s3.ap-northeast-2.amazonaws.com/basicProfile.png";

module.exports = () => {
  passport.use(
    new NaverStrategy(
      {
        clientID: `${process.env.NAVER_CLIENT_ID}`, // 카카오 로그인에서 발급받은 REST API 키
        clientSecret: `${process.env.NAVER_CLIENT_SECRET}`,
        callbackURL: "http://www.groupcalendars.shop/api/auth/naver/callback", // 카카오 로그인 Redirect URI 경로
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const exUser = await User.findOne({
            where: { snsId: profile.id, provider: "naver" },
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
              email: profile.email,
              nickname: profile.name,
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
                email: profile.email,
                nickname: profile.name,
                snsId: profile.id,
                provider: "naver",
                checkedCalendar: "",
              });

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
                  expiresIn: "10s",
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
                email: profile.email,
                nickname: profile.name,
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
