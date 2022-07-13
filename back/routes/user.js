const express = require("express");
const bcrypt = require("bcrypt");
const Sequelize = require("sequelize");
const dotenv = require("dotenv");
const { createClient } = require("redis");

const router = express.Router();
const refresh = require("../utils/refresh");
const jwt = require("../utils/jwt-util");
const redisClient = require("../utils/redis");
const authJWT = require("../utils/authJWT");
const { sequelize, User, ProfileImage } = require("../models");

const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");
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
  authJWT,
  uploadProfileImage.single("image"),
  async (req, res, next) => {
    try {
      const me = User.findOne({ where: { id: req.myId } });

      await sequelize.transaction(async (t) => {
        const profileImage = await ReviewImage.create(
          {
            src: req.file.location,
          },
          { transaction: t }
        );
        await me.addProfileImage(profileImage, { transaction: t });
      });

      return res.status(200).send({ success: true });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

router.post(
  "/changeUserProfileImage",
  authJWT,
  uploadProfileImage.single("image"),
  async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
      const myProfileImage = await ProfileImage.findOne({
        where: {
          UserId: req.myId,
        },
      });

      await myProfileImage.update(
        {
          src: req.file.location,
        },
        { transaction: t }
      );
      return res.status(200).send({ success: true });
    } catch (error) {
      console.error(error);
      console.error(error);
      await t.rollback();
      next(error);
    }
  }
);

router.post("/checkedCalendar", authJWT, async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const me = User.findOne({
      where: { id: req.myId },
    });

    await me.update(
      {
        checkedCalender: req.body.checkedList,
      },
      { transaction: t }
    );

    return res.status(200).status({ success: true });
  } catch (error) {
    console.error(error);
    await t.rollback();
    next(error);
  }
});

router.post("/signin", async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    where: {
      email: email,
    },
  });
  if (!user) {
    return res.status(401).send({
      message: "유저가 존재하지 않습니다!",
    });
  }
  const chk = await bcrypt.compare(password, user.password);
  if (!chk) {
    return res.status(401).send({
      message: "패스워드가 일치하지 않습니다!",
    });
  }
  const accessToken = jwt.sign(user);
  const refreshToken = jwt.refresh();
  redisClient.set(user.id, refreshToken);
  const userData = await User.findOne({
    where: { email: user.email },
    attributes: {
      exclude: ["password"],
    },
  });
  return res.status(200).send({
    userData,
    refreshToken,
    accessToken,
  });
});

router.post("/signup", async (req, res, next) => {
  try {
    const exUser = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (exUser) {
      return res.status(403).send({ message: "이미 사용중인 아이디입니다!" });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    await sequelize.transaction(async (t) => {
      const newUser = await User.create(
        {
          email: req.body.email,
          password: hashedPassword,
          nickname: req.body.nickname,
        },
        { transaction: t }
      );

      await newUser.createPrivateCalendar(
        {
          name: "MyCalendar",
        },
        { transaction: t }
      );
    });

    return res.status(200).send({ success: true });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/refresh", refresh);

router.post("/logout", authJWT, async (req, res, next) => {
  const client = redisClient;
  client.get(req.myId, function (err, clientCheck) {
    if (!clientCheck) {
      return res.status(405).send({ message: "유효하지 않은 토큰입니다." });
    }
    client.del(req.myId);
    return res.status(200).send({ message: "ok" });
  });
});

module.exports = router;
