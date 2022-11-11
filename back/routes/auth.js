const express = require("express");
const querystring = require("querystring");
const passport = require("passport");
const bcrypt = require("bcrypt");
const { redisClient } = require("../redis");
const { sequelize, User, ProfileImage, CalendarMember } = require("../models");
const { authJWT, refresh } = require("../middlewares/auth");
const router = express.Router();
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

const path = require("path");
const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");

const BASIC_IMG_SRC =
  "https://baeminback.s3.ap-northeast-2.amazonaws.com/basicProfile.png";

dotenv.config();
AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: "ap-northeast-2",
});

const uploadProfileImage = multer({
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: "baeminback",
    key(req, file, cb) {
      console.log(file);
      cb(
        null,
        `ProfileImages/${Date.now()}_${path.basename(file.originalname)}`
      );
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

router.post(
  "/setUserProfileImage",
  uploadProfileImage.single("image"),
  async (req, res, next) => {
    try {
      return res.status(200).send({ src: req.file.location });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

//local
router.post("/signin", async (req, res, next) => {
  try {
    const exUser = await User.findOne({
      where: { email: req.body.email, provider: "local" },
    });

    if (!exUser) {
      return res.status(401).send({
        message: "유저가 존재하지 않습니다!",
      });
    }

    const chk = await bcrypt.compare(req.body.password, exUser.password);
    if (!chk) {
      return res.status(402).send({
        message: "패스워드가 일치하지 않습니다!",
      });
    }

    const accessToken = jwt.sign({ id: exUser.id }, "jwt-secret-key", {
      algorithm: "HS256",
      expiresIn: "1d",
    });
    const refreshToken = jwt.sign({ id: exUser.id }, "jwt-secret-key", {
      algorithm: "HS256",
      expiresIn: "14d",
    });

    const userData = await User.findOne({
      where: { email: req.body.email },
      include: [
        {
          model: ProfileImage,
          attributes: {
            exclude: ["id", "UserId"],
          },
        },
      ],
      attributes: {
        exclude: ["password"],
      },
    });

    await redisClient.set(`${exUser.id}`, refreshToken);

    return res.status(200).send({
      userData,
      refreshToken,
      accessToken,
      local: true,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/signup", async (req, res, next) => {
  try {
    const exUser = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (exUser) {
      return res.status(401).send({ message: "이미 사용중인 아이디입니다!" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    await sequelize.transaction(async (t) => {
      const newUser = await User.create(
        {
          email: req.body.email,
          password: hashedPassword,
          nickname: req.body.nickname,
          provider: "local",
        },
        { transaction: t }
      );

      if (req.body.profileImageSrc) {
        const profileImage = await ProfileImage.create(
          {
            src: req.body.profileImageSrc,
          },
          {
            transaction: t,
          }
        );

        await newUser.addProfileImage(profileImage, { transaction: t });
      } else {
        const profileImage = await ProfileImage.create(
          {
            src: BASIC_IMG_SRC,
          },
          {
            transaction: t,
          }
        );
        await newUser.addProfileImage(profileImage, { transaction: t });
      }

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
    });

    return res.status(200).send({ success: true });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/checkedCalendar", authJWT, async (req, res, next) => {
  try {
    const me = await User.findOne({
      where: { id: req.myId },
    });

    checkedList = req.body.checkedList.join(",");

    await sequelize.transaction(async (t) => {
      await me.update(
        {
          checkedCalendar: checkedList,
        },
        { transaction: t }
      );
    });

    return res.status(200).send({ success: true });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//kakao
router.get("/kakao", passport.authenticate("kakao", { session: false }));

router.get(
  "/kakao/callback",
  passport.authenticate("kakao", {
    failureRedirect: "/api/auth/kakaoFail",
    session: false,
  }),
  (req, res) => {
    var userData = req.user;

    const query = querystring.stringify({
      id: userData.id,
      accessToken: userData.accessToken,
      refreshToken: userData.refreshToken,
      nickname: userData.nickname,
      email: userData.email,
      profileImage: userData.ProfileImages,
      checkedCalendar: userData.checkedCalendar,
      local: false,
    });
    res.redirect(
      "http://www.groupcalendars.shop/calendar/loginSuccess?" + query
    );
  }
);

router.get("/kakaoFail", (req, res, next) => {
  res.send(
    "<script>alert('이메일 사용에 동의하셔야 로그인이 가능합니다!');location.href='http://www.groupcalendars.shop/calendar';</script>"
  );
});

//naver
router.get(
  "/naver",
  passport.authenticate("naver", { session: false, authType: "reprompt" })
);

router.get(
  "/naver/callback",
  passport.authenticate("naver", {
    failureRedirect: "/api/auth/naverFail", // kakaoStrategy에서 실패한다면 실행
    session: false,
  }),
  (req, res) => {
    var userData = req.user;

    const query = querystring.stringify({
      id: userData.id,
      accessToken: userData.accessToken,
      refreshToken: userData.refreshToken,
      nickname: userData.nickname,
      email: userData.email,
      profileImage: userData.ProfileImages,
      checkedCalendar: userData.checkedCalendar,
      local: false,
    });
    res.redirect(
      "http://www.groupcalendars.shop/calendar/loginSuccess?" + query
    );
  }
);

router.get("/naverFail", (req, res, next) => {
  return res.redirect("http://www.groupcalendars.shop/calendar");
});

//google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/", // kakaoStrategy에서 실패한다면 실행
    session: false,
  }),
  (req, res) => {
    var userData = req.user;

    const query = querystring.stringify({
      id: userData.id,
      accessToken: userData.accessToken,
      refreshToken: userData.refreshToken,
      nickname: userData.nickname,
      email: userData.email,
      profileImage: userData.ProfileImages,
      checkedCalendar: userData.checkedCalendar,
      local: false,
    });
    res.redirect(
      "http://www.groupcalendars.shop/calendar/loginSuccess?" + query
    );
  }
);

router.get("/refresh", refresh);

router.get("/logout", authJWT, async (req, res, next) => {
  try {
    await redisClient.get(`${req.myId}`).then(() => {
      redisClient.del(`${req.myId}`);
    });

    return res.status(200).send({ success: true });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/changeNickname", authJWT, async (req, res, next) => {
  try {
    const me = await User.findOne({
      where: { id: req.myId },
    });

    await sequelize.transaction(async (t) => {
      await me.update(
        {
          nickname: req.body.nickname,
        },
        { transaction: t }
      );
    });

    const userData = await User.findOne({
      where: { id: req.myId },
      include: [
        {
          model: ProfileImage,
          attributes: {
            exclude: ["id", "UserId", "checkedCalendar"],
          },
        },
      ],
      attributes: {
        exclude: ["password"],
      },
    });

    return res.status(200).send(userData);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/changePassword", authJWT, async (req, res, next) => {
  try {
    const me = await User.findOne({
      where: { id: req.myId },
    });

    await sequelize.transaction(async (t) => {
      const hashedPassword = await bcrypt.hash(req.body.password, 12);

      await me.update(
        {
          password: hashedPassword,
        },
        { transaction: t }
      );
    });

    return res.status(200).send({ succes: true });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/changeProfileImage", authJWT, async (req, res, next) => {
  try {
    console.log(req.body.profileImageSrc);
    await sequelize.transaction(async (t) => {
      await ProfileImage.update(
        {
          src: req.body.profileImageSrc,
        },
        {
          where: { UserId: req.myId },
          transaction: t,
        }
      );
    });

    const userData = await User.findOne({
      where: { id: req.myId },
      include: [
        {
          model: ProfileImage,
          attributes: {
            exclude: ["id", "UserId", "checkedCalendar"],
          },
        },
      ],
      attributes: {
        exclude: ["password"],
      },
    });

    return res.status(200).send(userData);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/deleteProfileImage", authJWT, async (req, res, next) => {
  try {
    await sequelize.transaction(async (t) => {
      await ProfileImage.update(
        {
          src: BASIC_IMG_SRC,
        },
        {
          where: { UserId: req.myId },
          transaction: t,
        }
      );
    });

    const userData = await User.findOne({
      where: { id: req.myId },
      include: [
        {
          model: ProfileImage,
          attributes: {
            exclude: ["id", "UserId", "checkedCalendar"],
          },
        },
      ],
      attributes: {
        exclude: ["password"],
      },
    });

    return res.status(200).send(userData);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/resign", authJWT, async (req, res, next) => {
  try {
    await redisClient.get(`${req.myId}`).then(() => {
      redisClient.del(`${req.myId}`);
    });

    await sequelize.transaction(async (t) => {
      await User.destroy({ where: { id: req.myId }, transaction: t });
    });

    return res.status(200).send({ success: true });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
