const express = require("express");

const { sequelize, ProfileImage, ChildEvent } = require("../models");
const { User } = require("../models");
const { Calendar } = require("../models");
const { CalendarMember } = require("../models");
const { Invite } = require("../models");
const { Alert } = require("../models");
const router = express.Router();
const { Op } = require("sequelize");
const { authJWT } = require("../middlewares/auth");

// 개인 캘린더는 안보냄, 자신도 보내야함, 이메일 + 닉네임 + 사진
router.post("/getCalendarMembers", authJWT, async (req, res, next) => {
  try {
    const members = await CalendarMember.findAll({
      where: { CalendarId: req.body.calendarId },
    });

    return res.status(200).send(members);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/getMyCalendars", authJWT, async (req, res, next) => {
  try {
    const myCalendars = await CalendarMember.findAll({
      where: { UserId: req.myId },
    });
    var calendars = [];
    await Promise.all(
      myCalendars.map(async (myCalendar) => {
        const calendar = await Calendar.findOne({
          where: { id: myCalendar.CalendarId },
          include: [
            {
              model: User,
              as: "Owner",
              attributes: {
                exclude: ["password", "checkedCalendar", "snsId", "provider"],
              },
              include: [{ model: ProfileImage, attributes: ["src"] }],
            },
            {
              model: User,
              as: "CalendarMembers",
              where: {
                id: {
                  [Op.ne]: sequelize.literal("Calendar.OwnerId"),
                },
              },
              attributes: {
                exclude: ["password", "checkedCalendar", "snsId", "provider"],
              },
              through: { as: "userAuthority", attributes: ["authority"] },
              include: [{ model: ProfileImage, attributes: ["src"] }],
              required: false,
            },
          ],
        });
        const addAuthority = JSON.parse(JSON.stringify(calendar));
        addAuthority.authority = myCalendar.authority;

        calendars.push(addAuthority);
      })
    );

    return res.status(200).send(calendars);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/createGroupCalendar", authJWT, async (req, res, next) => {
  try {
    await sequelize.transaction(async (t) => {
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

      return res.status(200).send(newGroupCalendar);
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/editCalendar", authJWT, async (req, res, next) => {
  try {
    const myAuthority = await CalendarMember.findOne({
      where: {
        [Op.and]: {
          UserId: req.myId,
          CalendarId: req.body.calendarId,
        },
      },
    });

    if (myAuthority.authority < 3) {
      return res.status(400).send({ message: "권한이 없습니다!" });
    }
    const changeCalendar = await Calendar.findOne({
      where: { id: req.body.calendarId },
    });

    await sequelize.transaction(async (t) => {
      await changeCalendar.update(
        {
          name: req.body.calendarName,
          color: req.body.calendarColor,
        },
        {
          transaction: t,
        }
      );
    });

    return res.status(200).send(changeCalendar);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/deleteCalendar", authJWT, async (req, res, next) => {
  try {
    const calendar = await Calendar.findOne({
      where: {
        [Op.and]: {
          id: req.body.calendarId,
        },
      },
    });

    if (calendar.private) {
      return res
        .status(400)
        .send({ message: "개인 캘린더는 삭제할 수 없습니다!" });
    }

    const myAuthority = await CalendarMember.findOne({
      where: {
        [Op.and]: {
          UserId: req.myId,
          CalendarId: req.body.calendarId,
        },
      },
    });

    if (myAuthority.authority < 3) {
      return res.status(402).send({ message: "권한이 없습니다!" });
    }

    await sequelize.transaction(async (t) => {
      await calendar.destroy({
        force: true,
        transaction: t,
      });
    });

    return res.status(200).send({ success: true });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post("/inviteGroupCalendar", authJWT, async (req, res, next) => {
  try {
    const myAuthority = await CalendarMember.findOne({
      where: {
        [Op.and]: {
          UserId: req.myId,
          CalendarId: req.body.calendarId,
        },
      },
    });
    if (myAuthority?.authority < 3) {
      return res.status(400).send({ message: "권한이 없습니다!" });
    }

    const guest = await User.findOne({
      where: { email: req.body.guestEmail },
    });
    if (!guest) {
      return res.status(402).send({ message: "존재하지 않는 유저입니다!" });
    }

    const alreadyInvite = await Invite.findOne({
      where: {
        [Op.and]: {
          state: 0,
          guestId: guest.id,
          HostCalendarId: req.body.calendarId,
        },
      },
    });

    if (alreadyInvite) {
      return res
        .status(403)
        .send({ message: "이미 해당 달력에 초대장을 보낸 상대입니다!" });
    }

    const alreadyCalendarMember = await CalendarMember.findOne({
      where: {
        [Op.and]: { UserId: guest.id, CalendarId: req.body.calendarId },
      },
    });
    if (alreadyCalendarMember) {
      return res.status(405).send({ message: "이미 캘린더의 그룹원 입니다!" });
    }

    await sequelize.transaction(async (t) => {
      await Invite.create(
        {
          hostId: req.myId,
          guestId: guest.id,
          HostCalendarId: req.body.calendarId,
          authority: req.body.authority,
        },
        { transaction: t }
      );

      const InviteCalendar = await Calendar.findOne({
        where: { id: req.body.calendarId },
      });

      if (InviteCalendar?.private) {
        return res
          .status(406)
          .send({ message: "개인 캘린더에는 초대불가능 합니다!" });
      }

      await Alert.create(
        {
          UserId: guest.id,
          type: "calendarInvite",
          calendarId: InviteCalendar.id,
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

router.post("/resignCalendar", authJWT, async (req, res, next) => {
  try {
    const groupCalendar = await Calendar.findOne({
      where: { id: req.body.calendarId },
    });

    if (!groupCalendar) {
      return res.status(400).send({ message: "존재하지 않는 캘린더 입니다!" });
    }

    if (groupCalendar.private) {
      return res
        .status(402)
        .send({ message: "개인 캘린더는 탈퇴 할 수 없습니다!" });
    }

    await sequelize.transaction(async (t) => {
      await CalendarMember.destroy({
        where: {
          [Op.and]: { UserId: req.myId, CalendarId: req.body.calendarId },
        },
        transaction: t,
        force: true,
      });

      const myCalendar = await Calendar.findOne({
        where: {
          [Op.and]: {
            private: true,
            OwnerId: req.myId,
          },
        },
      });

      // childEvent에서 해당 캘린더에 대한 이벤트 모두 지워줘야함
      await ChildEvent.destroy({
        where: {
          [Op.and]: {
            privateCalendarId: myCalendar.id,
            originCalendarId: req.body.calendarId,
          },
        },
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

router.post("/sendOutUser", authJWT, async (req, res, next) => {
  try {
    const myAuthority = await CalendarMember.findOne({
      where: {
        [Op.and]: {
          UserId: req.myId,
          CalendarId: req.body.calendarId,
        },
      },
    });

    if (myAuthority.authority < 3) {
      return res.status(400).send({ message: "권한이 없습니다!" });
    }

    const member = await User.findOne({
      where: { email: req.body.userEmail },
    });
    if (!member) {
      return res.status(402).send({ message: "존재하지 않는 유저입니다!" });
    }

    const isGroupMember = await CalendarMember.findOne({
      where: {
        [Op.and]: { UserId: member.id, CalendarId: req.body.calendarId },
      },
    });

    if (!isGroupMember) {
      return res
        .status(403)
        .send({ message: "그룹 캘린더에 존재하지 않는 유저입니다!" });
    }

    const memberPrivateCalendar = await Calendar.findOne({
      where: {
        [Op.and]: {
          private: true,
          OwnerId: member.id,
        },
      },
    });

    await sequelize.transaction(async (t) => {
      await CalendarMember.destroy({
        where: {
          [Op.and]: { UserId: member.id, CalendarId: req.body.calendarId },
        },
        transaction: t,
        force: true,
      });

      await ChildEvent.destroy({
        where: {
          [Op.and]: {
            privateCalendarId: memberPrivateCalendar.id,
            originCalendarId: req.body.calendarId,
          },
        },
        transaction: t,
        force: true,
      });
    });

    return res.status(200).send({ success: true });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post("/acceptCalendarInvite", authJWT, async (req, res, next) => {
  try {
    const me = await User.findOne({ where: { id: req.myId } });

    const groupCalendar = await Calendar.findOne({
      where: {
        id: req.body.calendarId,
      },
    });
    if (!groupCalendar) {
      return res.status(400).send({ message: "존재하지 않는 캘린더입니다!" });
    }

    const alreadyCalendarMember = await CalendarMember.findOne({
      where: {
        [Op.and]: {
          UserId: req.myId,
          CalendarId: req.body.calendarId,
        },
      },
    });
    if (alreadyCalendarMember) {
      return res.status(402).send({ message: "이미 캘린더의 그룹원 입니다!" });
    }

    const invitation = await Invite.findOne({
      where: {
        [Op.and]: {
          guestId: req.myId,
          HostCalendarId: req.body.calendarId,
        },
      },
    });

    if (!invitation) {
      return res.status(403).send({ message: "존재하지 않는 초대장입니다!" });
    }

    await sequelize.transaction(async (t) => {
      await CalendarMember.create(
        {
          authority: invitation.authority,
          UserId: req.myId,
          CalendarId: req.body.calendarId,
        },
        {
          transaction: t,
        }
      );

      await Invite.destroy({
        where: {
          [Op.and]: {
            guestId: req.myId,
            HostCalendarId: req.body.calendarId,
          },
        },
        transaction: t,
        force: true,
      });

      const readAlert = await Alert.findOne({
        where: { id: req.body.alertId },
        transaction: t,
      });
      await readAlert.update({ checked: true }, { transaction: t });

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
        id: req.body.calendarId,
      },
    });
    if (!groupCalendar) {
      return res.status(400).send({ message: "존재하지 않는 캘린더입니다!" });
    }

    const alreadyCalendarMember = await CalendarMember.findOne({
      where: {
        [Op.and]: {
          UserId: req.myId,
          CalendarId: req.body.calendarId,
        },
      },
    });
    if (alreadyCalendarMember) {
      return res.status(402).send({ message: "이미 캘린더의 그룹원 입니다!" });
    }

    const invitation = await Invite.findOne({
      where: {
        [Op.and]: {
          guestId: req.myId,
          HostCalendarId: req.body.calendarId,
        },
      },
    });
    if (!invitation) {
      return res.status(403).send({ message: "존재하지 않는 초대장입니다!" });
    }

    await sequelize.transaction(async (t) => {
      await Alert.create(
        {
          UserId: invitation.hostId,
          type: "calendarInviteReject",
          content: `${me.nickname}님이 ${groupCalendar.name} 캘린더의 초대를 거부하셨습니다.`,
        },
        { transaction: t }
      );

      await Invite.destroy({
        where: {
          [Op.and]: {
            guestId: req.myId,
            HostCalendarId: req.body.calendarId,
          },
        },
        transaction: t,
        force: true,
      });

      const readAlert = await Alert.findOne({
        where: { id: req.body.alertId },
      });
      await readAlert.update({ checked: true }, { transaction: t });
    });
    return res.status(200).send({ success: true });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/giveAuthority", authJWT, async (req, res, next) => {
  try {
    const myAuthority = await CalendarMember.findOne({
      where: {
        [Op.and]: {
          UserId: req.myId,
          CalendarId: req.body.calendarId,
        },
      },
    });

    if (myAuthority.authority < 3) {
      return res.status(400).send({ message: "권한이 없습니다!" });
    }

    const member = await User.findOne({
      where: { email: req.body.userEmail },
    });
    if (!member) {
      return res.status(402).send({ message: "존재하지 않는 유저입니다!" });
    }

    const groupCalendar = await Calendar.findOne({
      where: { id: req.body.calendarId },
    });

    if (groupCalendar.private) {
      return res
        .status(403)
        .send({ message: "개인 캘린더의 권한은 수정할 수 없습니다!" });
    }

    if (!groupCalendar) {
      return res.status(405).send({ message: "존재하지 않는 캘린더입니다!" });
    }

    const isGroupMember = await CalendarMember.findOne({
      where: {
        [Op.and]: { UserId: member.id, CalendarId: req.body.calendarId },
      },
    });

    if (!isGroupMember) {
      return res
        .status(405)
        .send({ message: "그룹 캘린더에 존재하지 않는 유저입니다!" });
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
