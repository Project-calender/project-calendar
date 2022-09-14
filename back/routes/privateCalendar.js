const express = require("express");
const router = express.Router();

const { sequelize, PrivateCalendar, Calendar } = require("../models");
const { authJWT } = require("../middlewares/auth");

router.post("/editPrivateCalendar", authJWT, async (req, res, next) => {
  try {
    const changeCalendar = await PrivateCalendar.findOne({
      where: {
        id: req.body.calendarId,
      },
    });

    if (!changeCalendar) {
      return res.status(400).send({
        message: "개인 캘린더 조회 결과가 없습니다 입력값을 다시 확인해주세요",
      });
    }
    if (req.myId != changeCalendar.UserId) {
      return res.status(402).send({
        message: "수정 시도하는 유저가 개인 캘린더의 주인이 아닙니다",
      });
    }

    await sequelize.transaction(async (t) => {
      const privateCalendar = await changeCalendar.update(
        {
          name: req.body.calendarName,
          color: req.body.calendarColor,
        },
        { transaction: t }
      );
      return res.status(200).send(privateCalendar);
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/editPrivateCalendarColor", authJWT, async (req, res, next) => {
  try {
    const changeCalendar = await PrivateCalendar.findOne({
      where: {
        id: req.body.calendarId,
      },
    });

    if (!changeCalendar) {
      return res.status(400).send({
        message: "개인 캘린더 조회 결과가 없습니다 입력값을 다시 확인해주세요",
      });
    }
    if (req.myId != changeCalendar.UserId) {
      return res.status(402).send({
        message: "수정 시도하는 유저가 개인 캘린더의 주인이 아닙니다",
      });
    }

    await sequelize.transaction(async (t) => {
      const privateCalendar = await changeCalendar.update(
        {
          color: req.body.calendarColor,
        },
        { transaction: t }
      );
      return res.status(200).send(privateCalendar);
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
