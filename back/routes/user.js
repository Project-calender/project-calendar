const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const { sequelize, Calendar } = require("../models");
const { User, PrivateEvent, PrivateCalendar } = require("../models");
const router = express.Router();

const { verifyToken } = require("./middlewares");

// 개인 일정 가져오기 - 완
router.post("/getPrivateEvent", async (req, res, next) => {
  /*
    {
      "startDate":,
      "endDate":
    }
  */
  const exUser = await User.findOne({
    where: {
      id: 1,
    },
  });
  let startDate = String(req.body.startDate).split("-");
  startDate[2] = String(Number(startDate[2]));
  startDate = startDate.join("-");
  let endDate = String(req.body.endDate).split("-");
  endDate[2] = String(Number(endDate[2]) + 1);
  endDate = endDate.join("-");
  console.log(startDate);
  console.log(endDate);
  const exEvent = await exUser.getMyEvent({
    attributes: ["StartTime"],
    where: {
      startTime: {
        [Op.between]: [startDate, endDate],
      },
    },
  });
  return res.status(200).json({ exEvent: exEvent });
});

// 개인이벤트 만들기
router.post("/createPrivateEvent", async (req, res, next) => {
  /*
    "name": ,
    "color": ,
    "priority": ,
    "memo": ,
    "startTime": ,
    "endTime": 
  */
  const t = await sequelize.transaction();
  const f = await sequelize.transaction();
  try {
    const exUser = await User.findOne({
      where: {
        id: 1,
      },
    });
    const event = await PrivateEvent.create(
      {
        name: req.body.name,
        color: req.body.color,
        priority: req.body.priority,
        memo: req.body.memo,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
      },
      { transaction: t }
    );
    await t.commit();
    const privateEvent = await exUser.addMyEvent(event, { transaction: f });
    await f.commit();
    res.status(201).json(privateEvent);
  } catch (error) {
    console.error(error);
    await t.rollback();
    await f.rollback();
    next(error);
  }
});

// 개인이벤트 업데이트
router.post("/editPrivateEvent", async (req, res, next) => {
  /*
    {
      "eventId" : , 
      "name" : ,
      "color" : ,
      "priority" : ,
      "memo" : ,
      "startTime" : ,
      "endTime" : 
    }
  */
  try {
    const exUser = await User.findOne({
      where: {
        id: 1,
      },
    });
    console.log(exUser);
    const event = await PrivateEvent.findOne({
      id: req.body.eventId,
    });
    const privateEvent = await event.update({
      name: req.body.name,
      color: req.body.color,
      priority: req.body.priority,
      memo: req.body.memo,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
    });
    res.status(201).json(privateEvent);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

//개인 이벤트 삭제
router.post("/deletePrivateEvent", async (req, res, next) => {
  /*
    {
      "privateEventId": 
    }
  */
  const t = await sequelize.transaction();
  const f = await sequelize.transaction();
  try {
    const exUser = await User.findOne({
      where: {
        id: 1,
      },
    });

    const event = await exUser.getMyEvent({
      where: {
        id: req.body.privateEventId,
      },
    });
    // 이미 삭제한 개인이벤트일 경우
    if (event.length === 0) {
      return res.status(400).send({ message: "이미 삭제한 이벤트입니다" });
    }
    await exUser.removeMyEvent(event, { transaction: t });
    await t.commit();
    await PrivateEvent.destroy(
      {
        where: {
          id: req.body.privateEventId,
        },
      },
      { transaction: f }
    );
    await f.commit();
    res.status(204).send({ success: true });
  } catch (err) {
    console.error(err);
    await t.rollback();
    await f.rollback();
    next(err);
  }
});

router.post("/signin", (req, res, next) => {
  /*
    {
      "email": "sola2014@naver.com", 
      "password": "lee2030!"
    }
  */
  passport.authenticate("signin", (err, user, info) => {
    try {
      if (err) {
        console.error(err);
        next(err);
      }
      if (info) {
        return res.status(401).send(info);
      }
      return req.login(user, { session: false }, async (loginErr) => {
        if (loginErr) {
          return next(loginErr);
        }
        const refreshToken = jwt.sign(
          {
            sub: "refresh",
            email: user.email,
          },
          "jwt-secret-key",
          { expiresIn: "24h" }
        );
        const accessToken = jwt.sign(
          {
            sub: "access",
            email: user.email,
          },
          "jwt-secret-key",
          {
            expiresIn: "5m",
          }
        );
        const fullUserWithoutPassword = await User.findOne({
          where: { email: user.email },
          attributes: {
            exclude: ["password"],
          },
        });
        console.log("로그인 성공 확인");
        return res.status(200).send({
          fullUserWithoutPassword,
          refreshToken,
          accessToken,
        });
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  })(req, res, next);
});

router.post("/signup", async (req, res, next) => {
  /*
    {
      "email": , 
      "password": ,
      "nickname": 
    }
  */
  try {
    const exUser = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (exUser) {
      return res.status(403).send({ message: "이미 사용중인 아이디입니다." });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const createdUser = await User.create({
      email: req.body.email,
      password: hashedPassword,
      nickname: req.body.nickname,
    });

    await PrivateCalendar.create({
      name: createdUser.nickname,
      UserId: createdUser.id,
    });

    res.status(201).send({ success: true });
    console.log("회원가입 확인");
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/refreshToken", async (req, res, next) => {
  passport.authenticate(
    ("jwt",
    { session: false },
    (err, user, info) => {
      try {
        if (err) {
          console.error(err);
          return next(err);
        }
        if (info) {
          if (info?.name === "TokenExpiredError") {
            //refresh토큰 마저 만료
            return res.status(419).send({ error: info.name });
          }
          if (info?.name === "JsonWebTokenError") {
            //refresh토큰 잘못됨
            return res.status(419).send({ error: info.name });
          }
        }
        //토큰 재발급
        const refreshToken = jwt.sign(
          {
            sub: "refresh",
            email: user.email,
          },
          "jwt-secret-key",
          { expiresIn: "24h" }
        );
        const accessToken = jwt.sign(
          {
            sub: "access",
            email: user.email,
          },
          "jwt-secret-key",
          {
            expiresIn: "5m",
          }
        );
        return res.status(200).send({
          email: email,

          refreshToken,
          accessToken,
        });
      } catch (error) {
        console.error(error);
        next(error);
      }
    })
  );
});

router.post("/logout", (req, res) => {
  req.logout();
  req.session.destroy();
  res.status(200).send("ok");
});

module.exports = router;
