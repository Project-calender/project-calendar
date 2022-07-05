const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const Sequelize = require("Sequelize");
const Op = Sequelize.Op;

const { User } = require("../models");
const router = express.Router();

const { verifyToken } = require("./middlewares");

// 개인 일정 가져오기(년)
router.get("/year/:year/:month/:day", verifyToken, async (req, res, next) => {
  let date_ob = new Date();
  console.log(date_ob.getFullYear());
  const startdate = req.params.year;
  const enddate = String(Number(req.params.year) + 1);
  const exEvent = await req.user.getMyEvent({
    attributes: ["StartTime"],
    where: {
      startTime: {
        [Op.between]: [startdate, enddate],
      },
    },
  });

  return res.json({ exEvent: exEvent });
});

// 개인 일정 가져오기(월)
router.get("/month/:year/:month/:day", async (req, res, next) => {
  const exUser = await User.findOne({
    where: {
      id: 1,
    },
  });
  const startdate = req.params.year + "-" + req.params.month;
  const enddate = req.params.year + "-" + String(Number(req.params.month) + 1);
  const exEvent = await exUser.getMyEvent({
    attributes: ["StartTime"],
    where: {
      startTime: {
        [Op.between]: [startdate, enddate],
      },
    },
  });
  return res.json({ exEvent: exEvent });
});

router.post("/login", (req, res, next) => {
  passport.authenticate("signin", (err, user, info) => {
    try {
      console.log("??");
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
  try {
    const exUser = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (exUser) {
      return res.status(403).send("이미 사용중인 아이디입니다.");
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    await User.create({
      email: req.body.email,
      password: hashedPassword,
      nickname: req.body.nickname,
    });
    res.status(201).send("ok");
    // res.status(201).send('회원가입이 완료되었습니다.')
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

router.post("/user/logout", (req, res) => {
  req.logout();
  req.session.destroy();
  res.send("ok");
});

module.exports = router;
