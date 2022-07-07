const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { createClient, RedisClient } = require('redis');

const refresh = require('../utils/refresh');
const { sequelize, Calendar } = require("../models");
const { User, PrivateEvent, PrivateCalendar } = require("../models");
const router = express.Router();
const jwt = require('../utils/jwt-util');
const redisClient = require('../utils/redis');
const authJWT = require('../utils/authJWT');
const { client } = require("../utils/redis");



router.post('/getPrivateEvent', authJWT, async (req, res, next) => {

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

router.post('/createPrivateEvent', authJWT, async (req, res, next) => {

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

router.post('/editPrivateEvent', authJWT, async (req, res, next) => {

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

router.post('/deletePrivateEvent', authJWT, async (req, res, next) => {

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

router.post("/signin", async (req, res, next) => {
  /*
    {
      "email": "sola2014@naver.com", 
      "password": "lee2030!"
    }
  */
  const { email, password } = req.body;
  const user = await User.findOne({
    where: {
      email: email
    },
  });
  if (!user) {
    return res.status(401).send({
      ok: false,
      message: 'user not exist',
    });
  }
  const chk = await bcrypt.compare(password, user.password);
  if (!chk) {
    return  res.status(401).send({
      ok: false,
      message: 'password is incorrect',
    });
  }
  const accessToken = jwt.sign(user);
  const refreshToken = jwt.refresh();
  redisClient.set(user.id, refreshToken);
  const fullUserWithoutPassword = await User.findOne({
    where: { email: user.email },
    attributes: {
      exclude: ["password"],
    },
  });
  return res.status(200).send({
    fullUserWithoutPassword,
    refreshToken,
    accessToken,
  });
});

router.post("/signup", async (req, res, next) => {
  /*
    {
      "email": , 
      "password": ,
      "email": 
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
      email: req.body.email,
    });

    await PrivateCalendar.create({
      name: createdUser.email,
      UserId: createdUser.id
    })
    

    res.status(201).send({ success: true });
    console.log("회원가입 확인");
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get('/refresh', authJWT, refresh);

router.post("/logout", authJWT, async (req, res) => {
  // req.logout();
  const client = createClient({
    url: `redis://${process.env.REDIS_HOST}`,
    password: process.env.REDIS_PASSWORD,
  })
  
  await client.connect()
  await client.del(req.body.user.id)
  await client.disconnect();
  res.status(200).send("ok");
});

module.exports = router;
