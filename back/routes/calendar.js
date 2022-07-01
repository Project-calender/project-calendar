const express = require("express");

const { sequelize } = require("../models");
const { User } = require("../models");
const { Calendar } = require("../models");
const { Event } = require("../models");
const { CalendarMember } = require("../models");
const router = express.Router();

const { verifyToken } = require("./middlewares");

router.post("/createGroupCalendar", async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const exUser = await User.findOne({ where: { id: 1 } });

    //내가 속한 캘린더 중에 같은 이름이 있다면
    const notUnique = await Calendar.findOne({
      where: { name: req.body.calendarName },
    });

    if (notUnique) {
      return res
        .status(401)
        .send({ message: "이미 같은 이름의 캘린더가 존재합니다!" });
    }

    const newGroupCalendar = await Calendar.create(
      {
        name: req.body.calendarName,
        OwnerId: exUser.id,
      },
      {
        transaction: t,
      }
    );
    await newGroupCalendar.addCalendarMembers(exUser);

    //만든 사람은 최대 권한으로
    const authority = await CalendarMember.findOne({
      where: { UserId: exUser.id, CalendarId: newGroupCalendar.id },
    });
    await authority.update({ authority: 3 }, { transaction: t });

    await t.commit();
    return res.status(200).send({ success: true });
  } catch (error) {
    console.error(error);
    await t.rollback();
    next(error);
  }
});

router.post("/inviteGroupCalendar", async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    // const host = req.user
    const host = await User.findOne({ where: { id: 1 } });

    const guest = await User.findOne({
      where: { email: req.body.guestEmail },
    });

    if (!guest) {
      return res.status(402).send({ message: "존재하지 않는 유저입니다!" });
    }

    const alreadyGroupMember = await CalendarMember.findOne({
      where: { UserId: guest.id, CalendarId: req.body.groupCalendarId },
    });

    if (alreadyGroupMember) {
      return res.status(402).send({ message: "이미 그룹내의 멤버입니다!" });
    }

    await groupCalendar.addCalendarMembers(guest, { transaction: t });

    await t.commit();
    res.status(200).send({ success: true });
  } catch (error) {
    console.error(error);
    await t.rollback();
    next(error);
  }
});

router.post("/makeGroupEvent", async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    // const host = req.user
    const host = await User.findOne({ where: { id: 1 } });

    const groupCalendar = await Calendar.findOne({
      where: { id: req.body.groupCalendarId },
    });

    const newGroupEvent = await Event.create(
      {
        name: "newEvent1",
        color: "#9d0ded",
        priority: 1,
        memo: "testing...",
        startTime: new Date(),
        endTime: new Date(),
        EventHostId: host.id,
        CalendarId: groupCalendar.id,
      },
      { transaction: t }
    );

    await newGroupEvent.addEventMembers(host, { transaction: t });
    await t.commit();
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
      where: { id: req.body.guestId },
    });
    if (!guest) {
      return res.status(403).send({ message: "존재하지 않는 유저입니다!" });
    }

    const isGroupMember = await CalendarMember.findOne({
      where: { UserId: guest.id, CalendarId: req.body.groupCalendarId },
    });
    if (!isGroupMember) {
      return res
        .status(403)
        .send({ message: "그룹 캘린더에 존재하지 초대되지 않은 유저입니다!" });
    }

    const groupEvent = await Event.findOne({
      where: { id: req.body.groupEventId },
    });
    await groupEvent.addEventMembers(guest, { transaction: t });

    await t.commit();
    return res.status(200).send({ success: true });
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
      where: { UserId: editor.id, CalendarId: req.body.groupCalendarId },
    });

    if (hasAuthority.authority < 2) {
      return res.status(403).send({ message: "수정 권한이 없습니다!" });
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
        startTime: new Date(),
        endTime: new Date(),
      },
      { transaction: t }
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
  try {
    //const editor = req.user
    const editor = await User.findOne({ where: { id: 1 } });

    const hasAuthority = await CalendarMember.findOne({
      where: { UserId: editor.id, CalendarId: req.body.groupCalendarId },
    });

    if (hasAuthority.authority < 2) {
      return res.status(403).send({ message: "삭제 권한이 없습니다!" });
    }
    // const groupEvent = await Event.findOne({ where: { id: req.body.groupEventId } });
    await Event.destroy({
      where: { id: req.body.groupEventId },
      truncate: true,
      transaction: t,
    });

    await t.commit();
    res.status(200).send({ success: true });
  } catch (error) {
    console.error(error);
    await t.rollback();
    next(error);
  }
});

router.post("/giveAuthority", async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    //const editor = req.user
    const editor = await User.findOne({ where: { id: 1 } });

    const isOwner = await Calendar.findOne({
      where: { id: req.body.groupCalendarId },
    });

    if (editor.id != isOwner.OwnerId) {
      return res
        .status(403)
        .send({ message: "권한 부여는 달력의 오너만 가능합니다!" });
    }
    const isGroupMember = await CalendarMember.findOne({
      where: { UserId: member.id, CalendarId: req.body.groupCalendarId },
    });

    if (!isGroupMember) {
      return res
        .status(403)
        .send({ message: "그룹 캘린더에 존재하지 초대되지 않은 유저입니다!" });
    }

    if (req.body.newAuthority > 2) {
      return res
        .status(403)
        .send({ message: "달력 오너보다 낮은 권한만 부여할 수 있습니다!" });
    }
    await isGroupMember.update(
      {
        authority: req.body.newAuthority,
      },
      { transaction: t }
    );
    await t.commit();
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
