const express = require("express");
const Sequelize = require("sequelize");

const { sequelize, Calendar } = require("../models");
const { User, PrivateEvent, PrivateCalendar } = require("../models");
const router = express.Router();
const authJWT = require("../utils/authJWT");

// 개인이벤트 만들기
router.post("/createPrivateEvent", authJWT, async (req, res, next) => {
  try {
    const me = await User.findOne({
      where: {
        id: req.myId,
      },
    });
    const privateCalendar = await me.getPrivateCalendar();

    await sequelize.transaction(async (t) => {
      const privateEvent = await privateCalendar.createPrivateEvent(
        {
          name: req.body.eventName,
          color: req.body.color,
          busy: req.body.busy,
          memo: req.body.memo,
          allDay: req.body.allDay,
          startTime: req.body.startTime,
          endTime: req.body.endTime,
        },
        { transaction: t }
      );

      return res.status(200).send(privateEvent);
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 개인이벤트 업데이트
router.post("/editPrivateEvent", authJWT, async (req, res, next) => {
  try {
    const myEvent = await PrivateEvent.findOne({
      id: req.body.eventId,
    });

    if (!myEvent) {
      res
        .status(400)
        .json({ message: "수정할 개인이벤트의 조회 결과가 없습니다" });
    }

    await sequelize.transaction(async (t) => {
      await myEvent.update(
        {
          name: req.body.eventName,
          color: req.body.color,
          busy: req.body.busy,
          permission: req.body.permission,
          memo: req.body.memo,
          allDay: req.body.allDay,
          startTime: req.body.startTime,
          endTime: req.body.endTime,
        },
        { transaction: t }
      );
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//개인 이벤트 삭제
router.post("/deletePrivateEvent", authJWT, async (req, res, next) => {
  try {
    await sequelize.transaction(async (t) => {
      await PrivateEvent.destroy({
        where: { id: req.body.eventId },
        transaction: t,
        force: true,
      });
    });

    return res.status(200).send({ success: true });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
