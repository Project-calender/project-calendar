const express = require("express");

const {
  sequelize,
  Alert,
  Calendar,
  PrivateCalendar,
  CalendarMember,
  EventMember,
  PrivateEvent,
} = require("../models");
const { User } = require("../models");
const { Event } = require("../models");

const router = express.Router();
const { Op } = require("sequelize");
const authJWT = require("../utils/authJWT");

router.post("/getAllEvent", authJWT, async (req, res, next) => {
  try {
    const me = await User.findOne({ where: { id: req.myId } });
    req.body.endDate = req.body.endDate.split("-");
    req.body.endDate[2] = String(Number(req.body.endDate[2]) + 1);

    req.body.endDate = req.body.endDate.join("-");
    const privateEvents = await me.getPrivateCalendar({
      attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
      include: [
        {
          model: PrivateEvent,
          attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
          where: {
            [Op.or]: {
              startTime: {
                [Op.and]: {
                  [Op.gte]: req.body.startDate,
                  [Op.lte]: req.body.endDate,
                },
              },
              endTime: {
                [Op.and]: {
                  [Op.gte]: req.body.startDate,
                  [Op.lte]: req.body.endDate,
                },
              },
            },
          },
          separate: true,
        },
      ],
    });

    const groupEvents = await me.getGroupCalendars({
      attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
      include: [
        {
          model: Event,
          as: "GroupEvents",
          attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
          where: {
            [Op.or]: {
              startTime: {
                [Op.and]: {
                  [Op.gte]: req.body.startDate,
                  [Op.lte]: req.body.endDate,
                },
              },
              endTime: {
                [Op.and]: {
                  [Op.gte]: req.body.startDate,
                  [Op.lte]: req.body.endDate,
                },
              },
            },
          },
          separate: true,
        },
      ],
    });

    return res
      .status(200)
      .send({ privateEvents: privateEvents, groupEvents: groupEvents });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/getGroupEvent", authJWT, async (req, res, next) => {
  try {
    const events = await Event.findOne({
      where: { id: req.body.eventId },
      attributes: [
        "id",
        "name",
        "color",
        "priority",
        "memo",
        "startTime",
        "endTime",
        "EventHostId",
        "CalendarId",
      ],
      include: [
        {
          model: User,
          as: "EventHost",
          attributes: {
            exclude: [
              "password",
              "checkedCalendar",
              "createdAt",
              "updatedAt",
              "deletedAt",
            ],
          },
        },
        {
          model: User,
          as: "EventMembers",
          attributes: ["id", "email", "nickname"],
        },
      ],
    });
    return res.status(200).send(events);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/getEventByDate", authJWT, async (req, res, next) => {
  try {
    const me = await User.findOne({ where: { id: req.myId } });
    var start = req.body.date;
    var end = req.body.date.split("-");
    end[2] = String(Number(end[2]) + 1);
    end = end.join("-");

    const privateEvents = await me.getPrivateCalendar({
      attributes: {
        exclude: [
          "name",
          "color",
          "UserId",
          "createdAt",
          "updatedAt",
          "deletedAt",
        ],
      },
      include: [
        {
          model: PrivateEvent,
          attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
          where: {
            [Op.or]: {
              startTime: {
                [Op.and]: {
                  [Op.gte]: start,
                  [Op.lte]: end,
                },
              },
              endTime: {
                [Op.and]: {
                  [Op.gte]: start,
                  [Op.lte]: end,
                },
              },
            },
          },
          separate: true,
        },
      ],
    });

    const groupEvents = await me.getGroupCalendars({
      attributes: {
        exclude: [
          "name",
          "color",
          "OwnerId",
          "createdAt",
          "updatedAt",
          "deletedAt",
        ],
      },
      include: [
        {
          model: Event,
          as: "GroupEvents",
          attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
          where: {
            [Op.or]: {
              startTime: {
                [Op.and]: {
                  [Op.gte]: start,
                  [Op.lte]: end,
                },
              },
              endTime: {
                [Op.and]: {
                  [Op.gte]: start,
                  [Op.lte]: end,
                },
              },
            },
          },
          separate: true,
        },
      ],
    });

    return res
      .status(200)
      .send({ privateEvents: privateEvents, groupEvents: groupEvents });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/createGroupEvent", authJWT, async (req, res, next) => {
  try {
    const me = await User.findOne({
      where: { id: req.myId },
    });
    const isGroupMember = await CalendarMember.findOne({
      where: {
        [Op.and]: { UserId: req.myId, CalendarId: req.body.groupCalendarId },
      },
    });

    if (!isGroupMember) {
      return res
        .status(400)
        .send({ message: "그룹원의 멤버만 이벤트를 생성할 수 있습니다." });
    }

    await sequelize.transaction(async (t) => {
      const newGroupEvent = await Event.create(
        {
          name: req.body.eventName,
          color: req.body.color,
          priority: req.body.priority,
          memo: req.body.memo,
          startTime: req.body.startTime,
          endTime: req.body.endTime,
          allDay: req.body.allDay,
          EventHostId: req.myId,
          CalendarId: req.body.groupCalendarId,
        },
        { transaction: t }
      );

      await EventMember.create(
        {
          state: 1,
          UserId: req.myId,
          EventId: newGroupEvent.id,
        },
        { transaction: t }
      );

      const privateCalendar = await me.getPrivateCalendar();
      await privateCalendar.createPrivateEvent(
        {
          name: newGroupEvent.name,
          color: newGroupEvent.color,
          priority: newGroupEvent.priority,
          memo: newGroupEvent.memo,
          startTime: newGroupEvent.startTime,
          endTime: newGroupEvent.endTime,
          allDay: req.body.allDay,
          groupEventId: newGroupEvent.id,
          state: 1,
        },
        { transaction: t }
      );

      return res.status(200).send(newGroupEvent);
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/inviteGroupEvent", authJWT, async (req, res, next) => {
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
        .status(401)
        .send({ message: "그룹 캘린더에 존재하지 않는 유저입니다!" });
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
        .status(402)
        .send({ message: "이미 그룹 이벤트의 멤버입니다!" });
    }

    const alreadyInvite = await EventMember.findOne({
      where: {
        [Op.and]: { UserId: guest.id, EventId: groupEvent.id },
      },
    });
    if (alreadyInvite) {
      return res.status(405).send({ message: "이미 초대를 보낸 사람입니다!" });
    }

    await sequelize.transaction(async (t) => {
      const privateCalendar = await guest.getPrivateCalendar();
      await privateCalendar.createPrivateEvent(
        {
          name: groupEvent.name,
          color: groupEvent.color,
          priority: groupEvent.priority,
          memo: groupEvent.memo,
          startTime: groupEvent.startTime,
          endTime: groupEvent.endTime,
          groupEventId: groupEvent.id,
          state: 0,
        },
        { transaction: t }
      );

      await groupEvent.addEventMembers(guest, { transaction: t });

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
    });

    return res.status(200).send(guest);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/changeEventInviteState", authJWT, async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const me = await User.findOne({ where: { id: req.myId } });

    const invitedEvent = await Event.findOne({
      where: { id: req.body.invitedEventId },
    });

    var nowDate = new Date();

    if (!invitedEvent) {
      return res.status(400).send({ message: "존재하지 않는 이벤트 입니다!" });
    }

    if (invitedEvent.endTime < nowDate) {
      return res.status(401).send({ message: "이미 종료된 이벤트 입니다!" });
    }

    const changeState = await EventMember.findOne({
      where: {
        [Op.and]: {
          UserId: req.myId,
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

    const privateCalendar = await me.getPrivateCalendar();
    const copiedPrivateEvent = await PrivateEvent.findOne({
      where: {
        [Op.and]: {
          PrivateCalendarId: privateCalendar.id,
          groupEventId: req.body.invitedEventId,
        },
      },
    });
    await copiedPrivateEvent.update(
      {
        state: req.body.state,
      },
      {
        transaction: t,
      }
    );

    //자기한테까지 알림 가는거 막기
    const members = await invitedEvent.getEventMembers();
    if (req.body.state === 1) {
      await Promise.all(
        members.map(async (member) => {
          if (member.id !== me.id) {
            await Alert.create(
              {
                UserId: member.id,
                type: "eventNewMember",
                eventCalendarId: invitedEvent.CalendarId,
                eventDate: invitedEvent.startTime,
                content: `${me.nickname}님이 ${invitedEvent.name}이벤트에 참여했어요!`,
              },
              { transaction: t }
            );
          }
        })
      );
    } else if (req.body.state === 3) {
      await Promise.all(
        members.map(async (member) => {
          if (member.id !== me.id) {
            await Alert.create(
              {
                UserId: member.id,
                type: "eventLeaveMember",
                eventCalendarId: invitedEvent.CalendarId,
                eventDate: invitedEvent.startTime,
                content: `${me.nickname}님이 ${invitedEvent.name}이벤트에서 탈퇴했어요!!`,
              },
              { transaction: t }
            );
          }
        })
      );
    }

    await t.commit();
    return res.status(200).send({ success: true });
  } catch (error) {
    console.error(error);
    await t.rollback();
    next(error);
  }
});

router.post("/editGroupEvent", authJWT, async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const me = await User.findOne({ where: { id: req.myId } });
    const groupEvent = await Event.findOne({
      where: { id: req.body.groupEventId },
    });

    if (!groupEvent) {
      return res.status(400).send({ message: "존재하지 않는 이벤트 입니다!" });
    }

    const hasAuthority = await CalendarMember.findOne({
      where: {
        [Op.and]: { UserId: req.myId, CalendarId: req.body.groupCalendarId },
      },
    });

    if (hasAuthority.authority < 2) {
      return res.status(401).send({ message: "수정 권한이 없습니다!" });
    }

    await groupEvent.update(
      {
        name: req.body.eventName,
        color: req.body.color,
        priority: req.body.priority,
        memo: req.body.memo,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        allDay: req.body.allDay,
      },
      { transaction: t }
    );

    const privateCalendar = await me.getPrivateCalendar();
    const changePrivateEvent = await PrivateEvent.findOne({
      where: {
        [Op.and]: {
          groupEventId: req.body.groupEventId,
          PrivateCalendarId: privateCalendar.id,
        },
      },
    });
    changePrivateEvent.update(
      {
        name: req.body.name,
        color: req.body.color,
        priority: req.body.priority,
        memo: req.body.memo,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        allDay: req.body.allDay,
      },
      { transaction: t }
    );

    const members = await groupEvent.getEventMembers();
    await Promise.all(
      members.map(async (member) => {
        if (member.id !== req.myId) {
          await Alert.create(
            {
              UserId: member.id,
              type: "eventChanged",
              eventCalendarId: groupEvent.CalendarId,
              eventDate: groupEvent.startTime,
              content: `${groupEvent.name} 이벤트가 수정되었어요!`,
            },
            { transaction: t }
          );
        }
      })
    );

    await t.commit();
    return res.status(200).send({ success: true });
  } catch (error) {
    console.error(error);
    await t.rollback();
    next(error);
  }
});

router.post("/deleteGroupEvent", authJWT, async (req, res, next) => {
  try {
    const me = await User.findOne({ where: { id: req.myId } });
    const groupEvent = await Event.findOne({
      where: { id: req.body.groupEventId },
    });

    if (!groupEvent) {
      return res.status(400).send({ message: "존재하지 않는 이벤트 입니다!" });
    }

    const hasAuthority = await CalendarMember.findOne({
      where: {
        [Op.and]: { UserId: req.myId, CalendarId: req.body.groupCalendarId },
      },
    });

    if (hasAuthority.authority < 2) {
      return res.status(401).send({ message: "삭제 권한이 없습니다!" });
    }

    await sequelize.transaction(async (t) => {
      const gruopEventName = groupEvent.name;

      await Event.destroy({
        where: { id: req.body.groupEventId },
        force: true,
        transaction: t,
      });

      const privateCalendar = await me.getPrivateCalendar();
      await PrivateEvent.destroy({
        where: {
          [Op.and]: {
            groupEventId: req.body.groupEventId,
            PrivateCalendarId: privateCalendar.id,
          },
        },
        force: true,
        transaction: t,
      });

      const members = await groupEvent.getEventMembers();
      await Promise.all(
        members.map(async (member) => {
          if (member.id !== req.myId) {
            await Alert.create(
              {
                UserId: member.id,
                type: "eventRemoved",
                content: `${gruopEventName} 이벤트가 삭제되었어요!`,
              },
              { transaction: t }
            );
          }
        })
      );
    });

    return res.status(200).send({ success: true });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/searchEvent", authJWT, async (req, res, next) => {
  try {
    const searchWord = req.body.searchWord;

    const me = await User.findOne({ where: { id: req.myId } });

    const searchEvents = await me.getGroupEvents({
      where: { name: { [Op.like]: "%" + searchWord + "%" } },
      attributes: {
        exclude: [
          "color",
          "priority",
          "memo",
          "createdAt",
          "updatedAt",
          "deletedAt",
          "EventHostId",
        ],
      },
      joinTableAttributes: [],
      separate: true,
    });

    return res.status(200).send(searchEvents);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
