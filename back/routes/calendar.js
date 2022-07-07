const express = require("express");

const { sequelize } = require("../models");
const { User } = require("../models");
const { Calendar } = require("../models");
const { CalendarMember } = require("../models");
const { Invite } = require("../models");
const { Alert } = require("../models");
const router = express.Router();
const { Op } = require("sequelize");

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
    await t.commit();

    await CalendarMember.create(
      {
        authority: 3,
        UserId: exUser.id,
        CalendarId: newGroupCalendar.id,
      },
      {
        transaction: f,
      }
    );
    await f.commit();
    return res.status(200).send({ success: true });
  } catch (error) {
    console.error(error);
    await t.rollback();
    await f.rollback();
    next(error);
  }
});

router.post("/inviteGroupCalendar", async (req, res, next) => {
  const t = await sequelize.transaction();
  const f = await sequelize.transaction();
  try {
    // const host = req.user
    const host = await User.findOne({ where: { id: 1 } });

    const guest = await User.findOne({
      where: { email: req.body.guestEmail },
    });
    if (!guest) {
      return res.status(400).send({ message: "존재하지 않는 유저입니다!" });
    }

    const InviteCalendar = await Calendar.findOne({
      where: { id: req.body.groupCalendarId },
    });

    const alreadyCalendarMember = await CalendarMember.findOne({
      where: {
        [Op.and]: { UserId: guest.id, CalendarId: req.body.groupCalendarId },
      },
    });
    if (alreadyCalendarMember) {
      return res.status(400).send({ message: "이미 캘린더의 그룹원 입니다!" });
    }

    await Invite.create(
      {
        CalendarHostId: host.id,
        CalendarGuestId: guest.id,
        HostCalendarId: req.body.groupCalendarId,
      },
      { transaction: t }
    );

    await t.commit();

    await Alert.create(
      {
        UserId: guest.id,
        type: "calendarInvite",
        content: `${InviteCalendar.name} 캘린더에서 초대장을 보냈어요!`,
      },
      { transaction: f }
    );

    await f.commit();
    return res.status(200).send({ success: true });
  } catch (error) {
    console.error(error);
    await t.rollback();
    await f.rollback();
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
      where: {
        [Op.and]: {
          UserId: me.id,
          CalendarId: req.body.hostCalendarId,
        },
      },
    });
    if (alreadyCalendarMember) {
      return res.status(400).send({ message: "이미 캘린더의 그룹원 입니다!" });
    }

    await Invite.destroy({
      where: {
        [Op.and]: {
          CalendarGuestId: me.id,
          CalendarHostId: req.body.hostId,
          HostCalendarId: req.body.hostCalendarId,
        },
      },
      transaction: t,
    });

    await groupCalendar.addCalendarMembers(me, { transaction: t });

    const members = await groupCalendar.getCalendarMembers();
    await Promise.all(
      members.map((member) =>
        Alert.create(
          {
            UserId: member.id,
            type: "calenderNewMember",
            content: `${me.nickname}님이 ${groupCalendar.name}캘린더에 참여했어요!`,
          },
          { transaction: t }
        )
      )
    );
    await t.commit();

    return res.status(200).send({ success: true });
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
      where: {
        [Op.and]: {
          UserId: me.id,
          CalendarId: req.body.hostCalendarId,
        },
      },
    });
    if (alreadyCalendarMember) {
      return res.status(400).send({ message: "이미 캘린더의 그룹원 입니다!" });
    }

    await Invite.destroy({
      where: {
        [Op.and]: {
          CalendarGuestId: me.id,
          CalendarHostId: req.body.hostId,
          HostCalendarId: req.body.hostCalendarId,
        },
      },
      transaction: t,
    });

    await Alert.create(
      {
        UserId: req.body.hostId,
        type: "calendarInviteReject",
        content: `${me.nickname}님이 ${groupCalendar.name} 캘린더의 초대를 거부하셨습니다.`,
      },
      { transaction: t }
    );

    await t.commit();
    return res.status(200).send({ success: true });
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

    const groupCalendar = await Calendar.findOne({
      where: { id: req.body.groupCalendarId },
    });

    if (editor.id != groupCalendar.OwnerId) {
      return res
        .status(400)
        .send({ message: "권한 부여는 달력의 오너만 가능합니다!" });
    }

    const member = await User.findOne({
      where: { email: req.body.memberEmail },
    });
    if (!member) {
      return res.status(400).send({ message: "존재하지 않는 유저입니다!" });
    }

    const isGroupMember = await CalendarMember.findOne({
      where: {
        [Op.and]: { UserId: member.id, CalendarId: req.body.groupCalendarId },
      },
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

    await Alert.create(
      {
        UserId: member.id,
        type: "authorityChange",
        content: `유저님의 ${groupCalendar.name}캘린더 권한이 변경되었습니다!`,
      },
      { transaction: t }
    );
    await t.commit();
    return res.status(200).send({ success: true });
  } catch (error) {
    console.error(error);
    await t.rollback();
    next(error);
  }
});

module.exports = router;
