const express = require("express");

const { sequelize, Alert } = require("../models");
const { User } = require("../models");
const { Event } = require("../models");
const { CalendarMember } = require("../models");
const { EventMember } = require("../models");
const router = express.Router();
const { Op } = require("sequelize");

const { verifyToken } = require("./middlewares");

router.post("/createGroupEvent", async (req, res, next) => {
  const t = await sequelize.transaction();
  const f = await sequelize.transaction();
  try {
    // const host = req.user
    const host = await User.findOne({ where: { id: 1 } });
    const newGroupEvent = await Event.create(
      {
        name: req.body.eventName,
        color: req.body.color,
        priority: req.body.priority,
        memo: req.body.memo,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        EventHostId: host.id,
        CalendarId: req.body.groupCalendarId,
      },
      { transaction: t }
    );

    await t.commit();

    await EventMember.create(
      {
        state: 1,
        UserId: host.id,
        EventId: newGroupEvent.id,
      },
      { transaction: f }
    );
    await f.commit();
    res.status(200).send({ success: true });
  } catch (error) {
    console.error(error);
    await t.rollback();
    next(error);
  }
});

router.post("/inviteGroupEvent", async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const guest = await User.findOne({
      where: { email: req.body.guestEmail },
    });
    if (!guest) {
      return res.status(400).send({ message: "존재하지 않는 유저입니다!" });
    }

    const isGroupMember = await CalendarMember.findOne({
      where: {
        [Op.and]: { UserId: guest.id, CalendarId: req.body.groupCalendarId },
      },
    });
    if (!isGroupMember) {
      return res
        .status(403)
        .send({ message: "그룹 캘린더에 존재하지 초대되지 않은 유저입니다!" });
    }

    const groupEvent = await Event.findOne({
      where: { id: req.body.groupEventId },
    });

    const alreadyEventMember = await EventMember.findOne({
      where: {
        [Op.and]: { UserId: guest.id, EventId: groupEvent.id, state: 1 },
      },
    });
    if (alreadyEventMember) {
      return res
        .status(403)
        .send({ message: "이미 그룹 이벤트의 멤버입니다!" });
    }

    const alreadyInvite = await EventMember.findOne({
      where: {
        [Op.and]: { UserId: guest.id, EventId: groupEvent.id, state: 0 },
      },
    });
    if (alreadyInvite) {
      return res.status(403).send({ message: "이미 초대를 보낸 사람입니다!" });
    }

    await Alert.create(
      {
        UserId: guest.id,
        type: "eventInvite",
        eventCalendarId: req.body.groupCalendarId,
        eventDate: groupEvent.startTime,
        content: `${groupEvent.name} 이벤트에 초대되었습니다!`,
      },
      { transaction: t }
    );

    await groupEvent.addEventMembers(guest, { transaction: t });
    await t.commit();
    return res.status(200).send({ success: true });
  } catch (error) {
    console.error(error);
    await t.rollback();
    next(error);
  }
});

router.post("/changeEventInviteState", async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    //req.user
    const me = await User.findOne({ where: { id: 2 } });

    const invitedEvent = await Event.findOne({
      where: { id: req.body.invitedEventId },
    });

    if (!invitedEvent) {
      return res.status(403).send({ message: "존재하지 않는 이벤트 입니다!" });
    }

    const changeState = await EventMember.findOne({
      where: {
        [Op.and]: {
          UserId: me.id,
          EventId: invitedEvent.id,
        },
      },
    });

    await changeState.update(
      {
        state: req.body.state,
      },
      {
        transaction: t,
      }
    );

    const members = await invitedEvent.getEventMembers();
    if (req.body.state === 1) {
      await Promise.all(
        members.map((member) =>
          Alert.create(
            {
              UserId: member.id,
              type: "eventNewMember",
              eventCalendarId: invitedEvent.CalendarId,
              eventDate: invitedEvent.startTime,
              content: `${me.nickname}님의 ${invitedEvent.name}이벤트에 참여했어요!`,
            },
            { transaction: t }
          )
        )
      );
    } else if (req.body.state === 3) {
      await Promise.all(
        members.map((member) =>
          Alert.create(
            {
              UserId: member.id,
              type: "eventNewMember",
              eventCalendarId: invitedEvent.CalendarId,
              eventDate: invitedEvent.startTime,
              content: `${me.nickname}님의 ${invitedEvent.name}이벤트에서 탈퇴했어요!!`,
            },
            { transaction: t }
          )
        )
      );
    }

    await t.commit();
    res.status(200).send({ success: true });
  } catch (error) {
    console.error(error);
    await t.rollback();
    next(error);
  }
});

router.post("/editGroupEvent", async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    //const editor = req.user
    const editor = await User.findOne({ where: { id: 1 } });

    const hasAuthority = await CalendarMember.findOne({
      where: {
        [Op.and]: { UserId: editor.id, CalendarId: req.body.groupCalendarId },
      },
    });

    if (hasAuthority.authority < 2) {
      return res.status(400).send({ message: "수정 권한이 없습니다!" });
    }

    const groupEvent = await Event.findOne({
      where: { id: req.body.groupEventId },
    });
    await groupEvent.update(
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

    const members = await groupEvent.getEventMembers();
    await Promise.all(
      members.map((member) =>
        Alert.create(
          {
            UserId: member.id,
            type: "eventChanged",
            eventCalendarId: groupEvent.CalendarId,
            eventDate: groupEvent.startTime,
            content: `${groupEvent.name} 이벤트가 수정되었어요!`,
          },
          { transaction: t }
        )
      )
    );

    await t.commit();
    res.status(200).send({ success: true });
  } catch (error) {
    console.error(error);
    await t.rollback();
    next(error);
  }
});

router.post("/deleteGroupEvent", async (req, res, next) => {
  const t = await sequelize.transaction();
  const f = await sequelize.transaction();
  try {
    //const editor = req.user
    const editor = await User.findOne({ where: { id: 1 } });

    const hasAuthority = await CalendarMember.findOne({
      where: {
        [Op.and]: { UserId: editor.id, CalendarId: req.body.groupCalendarId },
      },
    });

    if (hasAuthority.authority < 2) {
      return res.status(400).send({ message: "삭제 권한이 없습니다!" });
    }

    const groupEvent = await Event.findOne({
      where: { id: req.body.groupEventId },
    });

    const members = await groupEvent.getEventMembers();
    await Promise.all(
      members.map((member) =>
        Alert.create(
          {
            UserId: member.id,
            type: "eventRemoved",
            content: `${groupEvent.name} 이벤트가 삭제되었어요!`,
          },
          { transaction: t }
        )
      )
    );

    await t.commit();

    await Event.destroy({
      where: { id: req.body.groupEventId },
      truncate: true,
      transaction: f,
    });
    await f.commit();
    res.status(200).send({ success: true });
  } catch (error) {
    console.error(error);
    await t.rollback();
    next(error);
  }
});

//이거 잘 모르겠음..
router.get("/searchEvent", async (req, res, next) => {
  try {
    res.status(200).send({ success: true });
  } catch (error) {
    console.error(error);
    await t.rollback();
    next(error);
  }
});
module.exports = router;
