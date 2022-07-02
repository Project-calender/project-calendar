const express = require("express");

const { sequelize } = require("../models");
const { User } = require("../models");
const { Calendar } = require("../models");
const { CalendarMember } = require("../models");
const { Invite } = require("../models");
const router = express.Router();

const { verifyToken } = require("./middlewares");

router.post("/createGroupCalendar", async (req, res, next) => {
  const t = await sequelize.transaction();
  const f = await sequelize.transaction();
  try {
    const exUser = await User.findOne({ where: { id: 1 } });

    //내가 속한 캘린더 중에 같은 이름이 있다면
    const notUnique = await Calendar.findOne({
      where: { name: req.body.calendarName },
    });

    if (notUnique) {
      return res
        .status(400)
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
    await newGroupCalendar.addCalendarMembers(exUser, {
      transaction: t,
    });

    await t.commit();

    //만든 사람은 최대 권한으로
    const authority = await CalendarMember.findOne({
      [Op.and]: {
        UserId: exUser.id,
        CalendarId: newGroupCalendar.id,
      },
    });

    await authority.update({ authority: 3 }, { transaction: f });

    f.commit();
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
      return res.status(400).send({ message: "존재하지 않는 유저입니다!" });
    }

    const alreadyCalendarMember = await CalendarMember.findOne({
      [Op.and]: { UserId: guest.id, CalendarId: req.body.groupCalendarId },
    });
    if (alreadyCalendarMember) {
      return res.status(400).send({ message: "이미 캘린더의 그룹원 입니다!" });
    }

    await Invite.create({
      CalendarHostId: host.id,
      CalendarGuestId: guest.id,
      HostCalendarId: req.body.groupCalendarId,
    });

    await t.commit();
    res.status(200).send({ success: true });
  } catch (error) {
    console.error(error);
    await t.rollback();
    next(error);
  }
});

router.post("/acceptCalendarInvite", async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const me = await User.findOne({ where: { id: 2 } });

    const groupCalendar = await Calendar.findOne({
      where: {
        id: req.body.hostCalendarId,
      },
    });
    if (!groupCalendar) {
      return res.status(400).send({ message: "존재하지 않는 캘린더입니다!" });
    }

    const alreadyCalendarMember = await CalendarMember.findOne({
      [Op.and]: {
        UserId: me.id,
        CalendarId: req.body.hostCalendarId,
      },
    });
    if (alreadyCalendarMember) {
      return res.status(400).send({ message: "이미 캘린더의 그룹원 입니다!" });
    }

    const inviteCalendar = await Invite.findOne({
      [Op.and]: {
        CalendarGuestId: me.id,
        CalendarHostId: req.body.hostId,
        HostCalendarId: req.body.hostCalendarId,
      },
    });

    await inviteCalendar.update(
      {
        state: 1,
      },
      { transaction: t }
    );

    await groupCalendar.addCalendarMembers(me, { transaction: t });

    await t.commit();
    res.status(200).send({ success: true });
  } catch (error) {
    console.error(error);
    await t.rollback();
    next(error);
  }
});

router.post("/rejectCalendarInvite", async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const me = await User.findOne({ where: { id: 2 } });

    const groupCalendar = await Calendar.findOne({
      where: {
        id: req.body.hostCalendarId,
      },
    });
    if (!groupCalendar) {
      return res.status(400).send({ message: "존재하지 않는 캘린더입니다!" });
    }

    const alreadyCalendarMember = await CalendarMember.findOne({
      [Op.and]: {
        UserId: me.id,
        CalendarId: req.body.hostCalendarId,
      },
    });
    if (alreadyCalendarMember) {
      return res.status(400).send({ message: "이미 캘린더의 그룹원 입니다!" });
    }

    const inviteCalendar = await Invite.findOne({
      [Op.and]: {
        CalendarGuestId: me.id,
        CalendarHostId: req.body.hostId,
        HostCalendarId: req.body.hostCalendarId,
      },
    });

    await inviteCalendar.update(
      {
        state: 2,
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
        .status(400)
        .send({ message: "권한 부여는 달력의 오너만 가능합니다!" });
    }

    const member = await User.findOne({
      where: { id: req.body.memberId },
    });
    if (!member) {
      return res.status(400).send({ message: "존재하지 않는 유저입니다!" });
    }

    const isGroupMember = await CalendarMember.findOne({
      [Op.and]: { UserId: member.id, CalendarId: req.body.groupCalendarId },
    });

    if (!isGroupMember) {
      return res
        .status(400)
        .send({ message: "그룹 캘린더에 존재하지 초대되지 않은 유저입니다!" });
    }

    if (req.body.newAuthority > 2) {
      return res
        .status(400)
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

module.exports = router;
