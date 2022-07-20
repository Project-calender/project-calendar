const express = require("express");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const { sequelize, Calendar } = require("../models");
const { User, PrivateEvent, PrivateCalendar } = require("../models");
const router = express.Router();
const authJWT = require("../utils/authJWT");

// 개인이벤트 만들기
router.post("/createPrivateEvent", authJWT, async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const me = await User.findOne({
      where: {
        id: req.myId,
      },
    });
    const privateCalendar = await me.getPrivateCalendar();

    await privateCalendar.createPrivateEvent(
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
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    await t.rollback();
    next(error);
  }
});

// 개인이벤트 업데이트
router.post("/editPrivateEvent", authJWT, async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const myEvent = await PrivateEvent.findOne({
      id: req.body.eventId,
    });
    await myEvent.update(
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
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    await t.rollback();
    next(err);
  }
});

//개인 이벤트 삭제
router.post("/deletePrivateEvent", authJWT, async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    // 이건 아예 삭제하는 코드
    await PrivateEvent.destroy({
      where: { id: req.body.eventId },
    });

    // 이건 데이터는 남겨둔채, 캘린더와의 관계를 끊는 코드
    // const privateCalendar = await me.getPrivateCalendar();
    // const privateEvent = await PrivateEvent.findOne({
    //   where: { id: req.body.eventId },
    // });
    // await privateCalendar.removePrivateEvent(privateEvent, {
    //   transaction: t,
    // });

    await t.commit();
    return res.status(200).send({ success: true });
  } catch (err) {
    console.error(err);
    await t.rollback();
    next(err);
  }
});

// 그룹이벤트를 개인이벤트에서만 수정하는 기능추가
// 연도에서 날짜로 이벤트 가져오기
module.exports = router;
