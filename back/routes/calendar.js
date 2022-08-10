const express = require("express");

const { sequelize } = require("../models");
const { User } = require("../models");
const { Calendar } = require("../models");
const { CalendarMember } = require("../models");
const { Invite } = require("../models");
const { Alert } = require("../models");
const router = express.Router();
const { Op } = require("sequelize");
const authJWT = require("../utils/authJWT");
const { deleteAlertsByCalendarId } = require("../realTimeAlerts");

router.post("/createGroupCalendar", authJWT, async (req, res, next) => {
  try {
    await sequelize.transaction(async (t) => {
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
          color: req.body.calendarColor,
          OwnerId: req.myId,
        },
        {
          transaction: t,
        }
      );

      await CalendarMember.create(
        {
          authority: 3,
          UserId: req.myId,
          CalendarId: newGroupCalendar.id,
        },
        {
          transaction: t,
        }
      );

      return res.status(200).send({ newGroupCalendar });
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/editGroupCalendar", authJWT, async (req, res, next) => {
  try {
    const changeCalendar = await Calendar.findOne({
      where: { id: req.body.calendarId },
    });

    await sequelize.transaction(async (t) => {
      if (changeCalendar.OwnerId !== req.myId) {
        return res
          .status(400)
          .send({ message: "캘린더의 오너만 캘린더를 수정할 수 있습니다!" });
      }

      await changeCalendar.update(
        {
          name: req.body.newCalendarName,
          color: req.body.newCalendarColor,
        },
        {
          transaction: t,
        }
      );

      const members = await changeCalendar.getCalendarMembers();
      await Promise.all(
        members.map((member) =>
          Alert.create(
            {
              UserId: member.id,
              type: "calenderChanged",
              content: `${changeCalendar.name}캘린더가 수정되었습니다. 확인해주세요!`,
            },
            { transaction: t }
          )
        )
      );
      return res.status(200).send(changeCalendar);
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/deleteGroupCalendar", authJWT, async (req, res, next) => {
  try {
    const exCalendar = await Calendar.findOne({
      where: {
        id: req.body.calendarId,
      },
    });
    if (!exCalendar) {
      return res.status(400).send({
        message:
          "삭제하려는 캘린더를 찾을 수 없습니다 입력값을 다시 확인해주세요",
      });
    }

    if (exCalendar.OwnerId !== req.myId) {
      return res.status(401).send({
        message:
          "삭제하려는 유저가 캘린더의 주인이 아닙니다 본인의 캘린더인지 다시 확인해주세요",
      });
    }

    await deleteAlertsByCalendarId(req.body.calendarId);

    await Calendar.destroy({
      where: {
        id: req.body.calendarId,
      },
      force: true,
    });

    return res.status(200).send({ success: true });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post("/inviteGroupCalendar", authJWT, async (req, res, next) => {
  try {
    const guest = await User.findOne({
      where: { email: req.body.guestEmail },
    });
    if (!guest) {
      return res.status(400).send({ message: "존재하지 않는 유저입니다!" });
    }

    const alreadyInvite = await Invite.findOne({
      where: {
        [Op.and]: {
          state: 0,
          CalendarGuestId: guest.id,
          HostCalendarId: req.body.calendarId,
        },
      },
    });
    if (alreadyInvite) {
      return res
        .status(400)
        .send({ message: "이미 해당 달력에 초대장을 보낸 상대입니다!" });
    }

    const alreadyCalendarMember = await CalendarMember.findOne({
      where: {
        [Op.and]: { UserId: guest.id, CalendarId: req.body.calendarId },
      },
    });
    if (alreadyCalendarMember) {
      return res.status(400).send({ message: "이미 캘린더의 그룹원 입니다!" });
    }

    await sequelize.transaction(async (t) => {
      await Invite.create(
        {
          CalendarHostId: req.myId,
          CalendarGuestId: guest.id,
          HostCalendarId: req.body.calendarId,
        },
        { transaction: t }
      );

      const InviteCalendar = await Calendar.findOne({
        where: { id: req.body.calendarId },
      });

      await Alert.create(
        {
          UserId: guest.id,
          type: "calendarInvite",
          content: `${InviteCalendar.name} 캘린더에서 초대장을 보냈어요!`,
        },
        { transaction: t }
      );
    });

    return res.status(200).send({ success: true });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/acceptCalendarInvite", authJWT, async (req, res, next) => {
  try {
    const me = await User.findOne({ where: { id: req.myId } });

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
          UserId: req.myId,
          CalendarId: req.body.hostCalendarId,
        },
      },
    });
    if (alreadyCalendarMember) {
      return res.status(400).send({ message: "이미 캘린더의 그룹원 입니다!" });
    }

    const deletedInvite = await Invite.findOne({
      where: {
        [Op.and]: {
          CalendarGuestId: req.myId,
          CalendarHostId: req.body.hostId,
          HostCalendarId: req.body.hostCalendarId,
        },
      },
    });
    if (!deletedInvite) {
      return res.status(400).send({ message: "존재하지 않는 초대장입니다!" });
    }

    await sequelize.transaction(async (t) => {
      await Invite.destroy({
        where: {
          [Op.and]: {
            CalendarGuestId: req.myId,
            CalendarHostId: req.body.hostId,
            HostCalendarId: req.body.hostCalendarId,
          },
        },
        transaction: t,
        force: true,
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
    });

    return res.status(200).send({ success: true });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/rejectCalendarInvite", authJWT, async (req, res, next) => {
  try {
    const me = await User.findOne({ where: { id: req.myId } });

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
          UserId: req.myId,
          CalendarId: req.body.hostCalendarId,
        },
      },
    });
    if (alreadyCalendarMember) {
      return res.status(400).send({ message: "이미 캘린더의 그룹원 입니다!" });
    }

    const deletedInvite = await Invite.findOne({
      where: {
        [Op.and]: {
          CalendarGuestId: req.myId,
          CalendarHostId: req.body.hostId,
          HostCalendarId: req.body.hostCalendarId,
        },
      },
    });
    if (!deletedInvite) {
      return res.status(400).send({ message: "존재하지 않는 초대장입니다!" });
    }

    await sequelize.transaction(async (t) => {
      await Invite.destroy({
        where: {
          [Op.and]: {
            CalendarGuestId: req.myId,
            CalendarHostId: req.body.hostId,
            HostCalendarId: req.body.hostCalendarId,
          },
        },
        transaction: t,
        force: true,
      });

      await Alert.create(
        {
          UserId: req.body.hostId,
          type: "calendarInviteReject",
          content: `${me.nickname}님이 ${groupCalendar.name} 캘린더의 초대를 거부하셨습니다.`,
        },
        { transaction: t }
      );
    });
    return res.status(200).send({ success: true });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/giveAuthority", authJWT, async (req, res, next) => {
  try {
    const groupCalendar = await Calendar.findOne({
      where: { id: req.body.calendarId },
    });

    if (req.myId != groupCalendar.OwnerId) {
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
        [Op.and]: { UserId: member.id, CalendarId: req.body.calendarId },
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

    await sequelize.transaction(async (t) => {
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
    });

    return res.status(200).send({ success: true });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
