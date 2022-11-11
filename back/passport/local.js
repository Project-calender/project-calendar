const passport = require("passport");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { redisClient } = require("../redis");
const { User, ProfileImage } = require("../models");
dotenv.config();

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email", // req.body.email
        passwordField: "password", // req.body.password
      },
      async (email, password, done) => {
        try {
          const exUser = await User.findOne({
            where: { email: email, provider: "local" },
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
            const result = await bcrypt.compare(password, exUser.password);

            if (result) {
              const accessToken = jwt.sign(
                { id: exUser.id },
                "jwt-secret-key",
                {
                  algorithm: "HS256",
                  expiresIn: "1d",
                }
              );
              const refreshToken = jwt.sign(
                { id: exUser.id },
                "jwt-secret-key",
                {
                  algorithm: "HS256",
                  expiresIn: "14d",
                }
              );

              var user = {
                id: exUser.id,
                email: exUser.email,
                nickname: exUser.nickname,
                ProfileImages: exUser.ProfileImages.src,
                checkedCalendar: exUser.checkedCalendar,
                accessToken: accessToken,
                refreshToken: refreshToken,
              };

              await redisClient.set(`${exUser.id}`, refreshToken);
              done(null, user);
            } else {
              done(null, false, { message: "비밀번호가 일치하지 않습니다." });
            }
          } else {
            done(null, false, { message: "존재하지 않는 유저입니다." });
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
