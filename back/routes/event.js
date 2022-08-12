const express = require("express");
const {
  addAlert,
  deleteAlerts,
  deleteAlertsByEventId,
} = require("../realTimeAlerts");

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
  RealTimeAlert,
} = require("../models");

const router = express.Router();
const { Op } = require("sequelize");
const authJWT = require("../utils/authJWT");

router.post("/getAllEvent", authJWT, async (req, res, next) => {
  try {
    const me = await User.findOne({ where: { id: req.myId } });
    var startDate = new Date(req.body.startDate);
    var endDate = new Date(req.body.endDate);
    endDate.setDate(endDate.getDate() + 1);

    const privateEvents = await me.getPrivateCalendar({
      include: [
        {
          model: PrivateEvent,
          where: {
            [Op.or]: {
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

              [Op.and]: {
                startTime: { [Op.lte]: startDate },
                endTime: { [Op.gte]: endDate },
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
          include: [
            {
              model: Event,
              as: "GroupEvents",
              where: {
                [Op.and]: {
                  [Op.or]: {
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

                    [Op.and]: {
                      startTime: { [Op.lte]: startDate },
                      endTime: { [Op.gte]: endDate },
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
            exclude: ["password", "checkedCalendar"],
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
        exclude: ["name", "color", "UserId"],
      },
      include: [
        {
          model: PrivateEvent,
          where: {
            [Op.or]: {
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

              [Op.and]: {
                startTime: { [Op.lte]: startDate },
                endTime: { [Op.gte]: endDate },
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
          include: [
            {
              model: Event,
              as: "GroupEvents",
              where: {
                [Op.and]: {
                  [Op.or]: {
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

                    [Op.and]: {
                      startTime: { [Op.lte]: startDate },
                      endTime: { [Op.gte]: endDate },
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
    const isGroupMember = await CalendarMember.findOne({
      where: {
        [Op.and]: { UserId: req.myId, CalendarId: req.body.calendarId },
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
          color: req.body.color ? req.body.color : null,
          busy: req.body.busy,
          permission: req.body.permission,
          memo: req.body.memo,
          startTime: req.body.startTime,
          endTime: req.body.endTime,
          allDay: req.body.allDay,
          EventHostId: req.myId,
          CalendarId: req.body.calendarId,
        },
        { transaction: t }
      );

      if (req.body.alerts) {
        if (req.body.allDay === 1) {
          await Promise.all(
            req.body.alerts.map(async (alert) => {
              if (alert.type === "day") {
                const content = `${req.body.eventName}시작 ${alert.time}일 전 입니다`;
                const date = new Date(req.body.startTime);
                date.setDate(date.getDate() - alert.time);
                date.setHours(alert.hour);
                date.setMinutes(parseInt(alert.minute ? alert.minute : 0));
                await addAlert(
                  req.myId,
                  newGroupEvent.id,
                  req.body.calendarId,
                  content,
                  date
                );
              } else if (alert.type === "week") {
                const content = `${req.body.eventName}시작 ${alert.time}주 전 입니다`;
                const date = new Date(req.body.startTime);
                date.setDate(date.getDate() - alert.time * 7);
                date.setHours(alert.hour);
                date.setMinutes(parseInt(alert.minute ? alert.minute : 0));
                await addAlert(
                  req.myId,
                  newGroupEvent.id,
                  req.body.calendarId,
                  content,
                  date
                );
              }
            })
          );
        } else {
          await Promise.all(
            req.body.alerts.map(async (alert) => {
              if (alert.type === "minute") {
                const content = `${req.body.eventName}시작 ${alert.time}분 전입니다!`;
                const date = new Date(req.body.startTime);
                date.setMinutes(date.getMinutes() - parseInt(alert.time));
                await addAlert(
                  req.myId,
                  newGroupEvent.id,
                  req.body.calendarId,
                  content,
                  date
                );
              } else if (alert.type === "hour") {
                const content = `${req.body.eventName}시작 ${alert.time}시간 전입니다!`;
                const date = new Date(req.body.startTime);
                date.setHours(date.getHours() - parseInt(alert.time));
                await addAlert(
                  req.myId,
                  newGroupEvent.id,
                  req.body.calendarId,
                  content,
                  date
                );
              } else if (alert.type === "day") {
                const content = `${req.body.eventName}시작 ${alert.time}일 전입니다!`;
                const date = new Date(req.body.startTime);
                date.setDate(date.getDate() - parseInt(alert.time));
                await addAlert(
                  req.myId,
                  newGroupEvent.id,
                  req.body.calendarId,
                  content,
                  date
                );
              } else if (alert.type === "week") {
                const content = `${req.body.eventName}시작 ${alert.time}주 전입니다!`;
                const date = new Date(req.body.startTime);
                date.setDate(date.getDate() - parseInt(alert.time) * 7);
                await addAlert(
                  req.myId,
                  newGroupEvent.id,
                  req.body.calendarId,
                  content,
                  date
                );
              }
            })
          );
        }
      }

      return res.status(200).send(newGroupEvent);
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/inviteCheck", authJWT, async (req, res, next) => {
  try {
    const guest = await User.findOne({
      where: { email: req.body.guestEmail },
      attributes: ["id", "email", "nickname"],
      include: [
        {
          model: ProfileImage,
          attributes: {
            exclude: ["id", "UserId"],
          },
        },
      ],
    });

    if (!guest) {
      return res
        .status(400)
        .send({ message: "존재하지 않는 유저입니다!", canInvite: false });
    }

    const isGroupMember = await CalendarMember.findOne({
      where: {
        [Op.and]: { UserId: guest.id, CalendarId: req.body.calendarId },
      },
    });
    if (!isGroupMember) {
      return res.status(402).send({
        message: "그룹 캘린더에 존재하지 않는 유저입니다!",
        canInvite: false,
      });
    }

    const groupEvent = await Event.findOne({
      where: { id: req.body.eventId },
    });

    const alreadyEventMember = await EventMember.findOne({
      where: {
        [Op.and]: { UserId: guest.id, EventId: groupEvent.id, state: 1 },
      },
    });
    if (alreadyEventMember) {
      return res
        .status(403)
        .send({ message: "이미 그룹 이벤트의 멤버입니다!", canInvite: false });
    }

    const alreadyInvite = await EventMember.findOne({
      where: {
        [Op.and]: { UserId: guest.id, EventId: groupEvent.id },
      },
    });
    if (alreadyInvite) {
      return res
        .status(405)
        .send({ message: "이미 초대를 보낸 사람입니다!", canInvite: false });
    }

    return res.status(200).send({ guest, canInvite: true });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/inviteGroupEvent", authJWT, async (req, res, next) => {
  try {
    const groupEvent = await Event.findOne({
      where: { id: req.body.eventId },
    });

    await sequelize.transaction(async (t) => {
      await Promise.all(
        req.body.guests.map(async (guestEmail) => {
          const guest = await User.findOne({
            where: { email: guestEmail },
          });

          await groupEvent.addEventMembers(guest, { transaction: t });

          const privateCalendar = await guest.getPrivateCalendar();
          await privateCalendar.createPrivateEvent(
            {
              name: groupEvent.name,
              color: groupEvent.color,
              busy: groupEvent.busy,
              memo: groupEvent.memo,
              allDay: groupEvent.allDay,
              startTime: groupEvent.startTime,
              endTime: groupEvent.endTime,
              groupEventId: groupEvent.id,
              state: 0,
            },
            { transaction: t }
          );

          await Alert.create(
            {
              UserId: guest.id,
              type: "event",
              eventCalendarId: req.body.calendarId,
              eventDate: groupEvent.startTime,
              content: `${groupEvent.name} 이벤트에 초대되었습니다!`,
            },
            { transaction: t }
          );
        })
      );
    });

    return res.status(200).send({ success: true });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/changeEventInviteState", authJWT, async (req, res, next) => {
  try {
    const me = await User.findOne({ where: { id: req.myId } });

    const invitedEvent = await Event.findOne({
      where: { id: req.body.eventId },
    });

    if (!invitedEvent) {
      return res.status(400).send({ message: "존재하지 않는 이벤트 입니다!" });
    }

    const changeState = await EventMember.findOne({
      where: {
        [Op.and]: {
          UserId: req.myId,
          EventId: invitedEvent.id,
        },
      },
    });

    await sequelize.transaction(async (t) => {
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
            groupEventId: req.body.eventId,
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
    });

    return res.status(200).send({ success: true });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/editGroupEvent", authJWT, async (req, res, next) => {
  try {
    await sequelize.transaction(async (t) => {
      const groupEvent = await Event.findOne({
        where: { id: req.body.eventId },
      });

      if (!groupEvent) {
        return res
          .status(400)
          .send({ message: "존재하지 않는 이벤트 입니다!" });
      }

      const hasAuthority = await CalendarMember.findOne({
        where: {
          [Op.and]: { UserId: req.myId, CalendarId: req.body.calendarId },
        },
      });

      if (hasAuthority.authority < 2) {
        return res.status(403).send({ message: "수정 권한이 없습니다!" });
      }

      //'2022-07-26 07:00:18'
      await groupEvent.update(
        {
          name: req.body.eventName,
          color: req.body.color ? req.body.color : null,
          busy: req.body.busy,
          permission: req.body.permission,
          memo: req.body.memo,
          startTime: new Date(req.body.startTime),
          endTime: new Date(req.body.endTime),
          allDay: req.body.allDay,
        },
        { transaction: t }
      );

      await deleteAlerts(req.myId, req.body.eventId);

      if (req.body.alerts) {
        if (req.body.allDay === 1) {
          await Promise.all(
            req.body.alerts.map(async (alert) => {
              if (alert.type === "day") {
                const content = `${req.body.eventName}시작 ${alert.time}일 전 입니다`;
                const date = new Date(req.body.startTime);
                date.setDate(date.getDate() - alert.time);
                date.setHours(alert.hour);
                date.setMinutes(parseInt(alert.minute ? alert.minute : 0));
                await addAlert(
                  req.myId,
                  newGroupEvent.id,
                  req.body.calendarId,
                  content,
                  date
                );
              } else if (alert.type === "week") {
                const content = `${req.body.eventName}시작 ${alert.time}주 전 입니다`;
                const date = new Date(req.body.startTime);
                date.setDate(date.getDate() - alert.time * 7);
                date.setHours(alert.hour);
                date.setMinutes(parseInt(alert.minute ? alert.minute : 0));
                await addAlert(
                  req.myId,
                  newGroupEvent.id,
                  req.body.calendarId,
                  content,
                  date
                );
              }
            })
          );
        } else {
          await Promise.all(
            req.body.alerts.map(async (alert) => {
              if (alert.type === "minute") {
                const content = `${req.body.eventName}시작 ${alert.time}분 전입니다!`;
                const date = new Date(req.body.startTime);
                date.setMinutes(date.getMinutes() - parseInt(alert.time));
                await addAlert(req.myId, req.body.eventId, content, date);
              } else if (alert.type === "hour") {
                const content = `${req.body.eventName}시작 ${alert.time}시간 전입니다!`;
                const date = new Date(req.body.startTime);
                date.setHours(date.getHours() - alert.time);
                await addAlert(req.myId, req.body.eventId, content, date);
              } else if (alert.type === "day") {
                const content = `${req.body.eventName}시작 ${alert.time}일 전입니다!`;
                const date = new Date(req.body.startTime);
                date.setDate(date.getDate() - alert.time);
                await addAlert(req.myId, req.body.eventId, content, date);
              } else if (alert.type === "week") {
                const content = `${req.body.eventName}시작 ${alert.time}주 전입니다!`;
                const date = new Date(req.body.startTime);
                date.setDate(date.getDate() - alert.time * 7);
                await addAlert(req.myId, req.body.eventId, content, date);
              }
            })
          );
        }
      }

      const me = await User.findOne({ where: { id: req.myId } });
      const privateCalendar = await me.getPrivateCalendar();
      const changePrivateEvent = await PrivateEvent.findOne({
        where: {
          [Op.and]: {
            groupEventId: req.body.eventId,
            PrivateCalendarId: privateCalendar.id,
          },
        },
      });
      await changePrivateEvent.update(
        {
          name: req.body.name,
          color: req.body.color,
          busy: req.body.busy,
          memo: req.body.memo,
          startTime: req.body.startTime,
          endTime: req.body.endTime,
          allDay: req.body.allDay,
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

router.post("/deleteGroupEvent", authJWT, async (req, res, next) => {
  try {
    const me = await User.findOne({ where: { id: req.myId } });
    const groupEvent = await Event.findOne({
      where: { id: req.body.eventId },
    });

    if (!groupEvent) {
      return res.status(400).send({ message: "존재하지 않는 이벤트 입니다!" });
    }

    const hasAuthority = await CalendarMember.findOne({
      where: {
        [Op.and]: { UserId: req.myId, CalendarId: req.body.calendarId },
      },
    });

    if (hasAuthority.authority < 2) {
      return res.status(400).send({ message: "삭제 권한이 없습니다!" });
    }

    await sequelize.transaction(async (t) => {
      const gruopEventName = groupEvent.name;

      await deleteAlertsByEventId(req.body.eventId);

      await Event.destroy({
        where: { id: req.body.eventId },
        force: true,
        transaction: t,
      });

      await deleteAlerts(req.myId, groupEvent.id);

      const privateCalendar = await me.getPrivateCalendar();
      await PrivateEvent.destroy({
        where: {
          [Op.and]: {
            groupEventId: req.body.eventId,
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
        exclude: ["color", "priority", "memo", "EventHostId"],
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

router.post("/test2", async (req, res, next) => {
  try {
    const now = new Date();

    return res.status(200).send(now);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/test", async (req, res, next) => {
  try {
    const test = await User.findOne({
      where: { id: 1 },
      include: [
        {
          model: Calendar,
          as: "GroupCalendars",
          through: { attributes: [] },
        },
      ],
    });
    return res.status(200).send(test);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
