const express = require("express");
const addAlert = require("../realTimeAlerts");

const {
  sequelize,
  User,
  Event,
  Alert,
  Calendar,
  ProfileImage,
  PrivateCalendar,
  CalendarMember,
  EventMember,
  PrivateEvent,
} = require("../models");

const router = express.Router();
const { Op } = require("sequelize");
const authJWT = require("../utils/authJWT");

router.post("/getAllEvent", authJWT, async (req, res, next) => {
  try {
    const me = await User.findOne({ where: { id: req.myId } });
    // req.body.endDate = req.body.endDate.split("-");
    // req.body.endDate[2] = String(Number(req.body.endDate[2]) + 1);
    // req.body.endDate = req.body.endDate.join("-");
    var startDate = new Date(req.body.startDate);
    var endDate = new Date(req.body.endDate);
    endDate.setDate(endDate.getDate() + 1);

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
                  [Op.gte]: startDate,
                  [Op.lte]: endDate,
                },
              },
              endTime: {
                [Op.and]: {
                  [Op.gte]: startDate,
                  [Op.lte]: endDate,
                },
              },
            },
          },
          separate: true,
        },
      ],
    });

    const groupCalendars = await CalendarMember.findAll({
      where: { UserId: req.myId },
    });

    var groupEvents = [];
    await Promise.all(
      groupCalendars.map(async (groupCalendar) => {
        var groupEvent = await Calendar.findAll({
          where: { id: groupCalendar.CalendarId },
          attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
          include: [
            {
              model: Event,
              as: "GroupEvents",
              attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
              where: {
                [Op.and]: {
                  [Op.or]: {
                    startTime: {
                      [Op.and]: {
                        [Op.gte]: startDate,
                        [Op.lte]: endDate,
                      },
                    },
                    endTime: {
                      [Op.and]: {
                        [Op.gte]: startDate,
                        [Op.lte]: endDate,
                      },
                    },
                  },
                  permission: { [Op.lte]: groupCalendar.authority },
                },
              },
              separate: true,
            },
          ],
        });

        groupEvent.push({ authority: groupCalendar.authority });
        groupEvents.push(groupEvent);
      })
    );

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
        "permission",
        "busy",
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
          include: [
            {
              model: ProfileImage,
              attributes: ["src"],
            },
          ],
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
    var startDate = new Date(req.body.startDate);
    var endDate = new Date(req.body.endDate);
    endDate.setDate(endDate.getDate() + 1);

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
                  [Op.gte]: startDate,
                  [Op.lte]: endDate,
                },
              },
              endTime: {
                [Op.and]: {
                  [Op.gte]: startDate,
                  [Op.lte]: endDate,
                },
              },
            },
          },
          separate: true,
        },
      ],
    });

    const groupCalendars = await CalendarMember.findAll({
      where: { UserId: req.myId },
    });

    var groupEvents = [];
    await Promise.all(
      groupCalendars.map(async (groupCalendar) => {
        var groupEvent = await Calendar.findAll({
          where: { id: groupCalendar.CalendarId },
          attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
          include: [
            {
              model: Event,
              as: "GroupEvents",
              attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
              where: {
                [Op.and]: {
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
                  permission: { [Op.lte]: groupCalendar.authority },
                },
              },
            },
          ],
        });

        if (groupEvent.length !== 0) {
          groupEvents.push(groupEvent);
        }
      })
    );

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
    // const me = await User.findOne({
    //   where: { id: req.myId },
    // });
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

      // await EventMember.create(
      //   {
      //     state: 4,
      //     UserId: req.myId,
      //     EventId: newGroupEvent.id,
      //   },
      //   { transaction: t }
      // );

      // const privateCalendar = await me.getPrivateCalendar();
      // await privateCalendar.createPrivateEvent(
      //   {
      //     name: newGroupEvent.name,
      //     color: newGroupEvent.color,
      //     priority: newGroupEvent.priority,
      //     memo: newGroupEvent.memo,
      //     startTime: newGroupEvent.startTime,
      //     endTime: newGroupEvent.endTime,
      //     allDay: req.body.allDay,
      //     groupEventId: newGroupEvent.id,
      //     state: 4,
      //   },
      //   { transaction: t }
      // );

      return res.status(200).send(newGroupEvent);
    });
  } catch (error) {
    console.error(error);
    await t.rollback();
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
        .status(400)
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
          type: "event",
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

    if (!invitedEvent) {
      await t.rollback();
      return res.status(400).send({ message: "존재하지 않는 이벤트 입니다!" });
    }
    // var nowDate = new Date();
    // if (invitedEvent.endTime < nowDate) {
    //   await t.rollback();
    //   return res.status(400).send({ message: "이미 종료된 이벤트 입니다!" });
    // }

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
                type: "event",
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
                type: "event",
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
      await t.rollback();
      return res.status(400).send({ message: "존재하지 않는 이벤트 입니다!" });
    }

    const hasAuthority = await CalendarMember.findOne({
      where: {
        [Op.and]: { UserId: req.myId, CalendarId: req.body.groupCalendarId },
      },
    });

    if (hasAuthority.authority < 2) {
      await t.rollback();
      return res.status(400).send({ message: "수정 권한이 없습니다!" });
    }

    await groupEvent.update(
      {
        name: req.body.eventName,
        color: req.body.color,
        busy: req.body.busy,
        permission: req.body.permission,
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
        busy: req.body.priority,
        memo: req.body.memo,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        allDay: req.body.allDay,
      },
      { transaction: t }
    );

    // const members = await groupEvent.getEventMembers();
    // await Promise.all(
    //   members.map(async (member) => {
    //     if (member.id !== req.myId) {
    //       await Alert.create(
    //         {
    //           UserId: member.id,
    //           type: "event",
    //           eventCalendarId: groupEvent.CalendarId,
    //           eventDate: groupEvent.startTime,
    //           content: `${groupEvent.name} 이벤트가 수정되었어요!`,
    //         },
    //         { transaction: t }
    //       );
    //     }
    //   })
    // );

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
      await t.rollback();
      return res.status(400).send({ message: "존재하지 않는 이벤트 입니다!" });
    }

    const hasAuthority = await CalendarMember.findOne({
      where: {
        [Op.and]: { UserId: req.myId, CalendarId: req.body.groupCalendarId },
      },
    });

    if (hasAuthority.authority < 2) {
      await t.rollback();
      return res.status(400).send({ message: "삭제 권한이 없습니다!" });
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

// 서버가 재시작 될 시 모든 알람이 삭제된다,,

// 밑의 알람을 hooks로 빼고 함수로 실행하면 된다. ?

// db에 따로 저장하고 서버가 실행될때 반복문으로 다 돌면서 다시 알람을 설정한다?

//,,알람을 바꾸거나 취소할땐 어떻게 해야하지?

// db에 cron table을 따로만든다 -> 객체 이름을 저장한다. event userId column과 같이 추가 해놓는다

// 변경시 ? -> 기존 객체 삭제 새로 만들기

// 삭제 ? -> 그냥 삭제

router.post("/test", async (req, res, next) => {
  try {
    //req.body [ { type: 'hour' } ]
    if (req.body.alert) {
      var afterMinute = new Date();
      addAlert(
        req.myId,
        "test",
        afterMinute.setDate(afterMinute.getMinutes() + 1)
      );
    }

    return res.status(200).send({ succes: true });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
