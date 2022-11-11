const express = require("express");
const short = require("short-uuid");
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
  ChildEvent,
  RealTimeAlert,
} = require("../models");

const router = express.Router();
const { Op } = require("sequelize");
const { authJWT } = require("../middlewares/auth");
const { inviteGuests } = require("../commons/event");
const {
  addAlert,
  addChildAlert,
  deleteAlerts,
  deleteChildAlerts,
} = require("../commons/realTimeAlerts");

router.post("/test", async (req, res, next) => {
  try {
    const exUser = await User.findOne({
      where: { id: 1 },
      include: [
        {
          model: ProfileImage,
          attributes: {
            exclude: ["id", "UserId"],
          },
        },
      ],
    });

    console.log(exUser.ProfileImages[0].src);
    return res.status(200).send(exUser);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/getCalendarMembers", authJWT, async (req, res, next) => {
  try {
    const members = await Calendar.findOne({
      where: { id: req.body.calendarId },
      include: [
        {
          model: User,
          as: "CalendarMembers",
          attributes: {
            exclude: ["password", "checkedCalendar", "snsId", "provider"],
          },
          through: { attributes: [] },
          include: [{ model: ProfileImage, attributes: ["src"] }],
        },
      ],
    });

    if (!members) {
      return res.status(400).send({ message: "존재하지 않는 캘린더 입니다!" });
    }

    if (members.private && members.OwnerId == req.myId) {
      return res.status(200).send([]);
    }

    return res.status(200).send(members.CalendarMembers);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/getAllEventForYear", authJWT, async (req, res, next) => {
  try {
    var startDate = new Date(req.body.startDate);
    var endDate = new Date(startDate);

    startDate.setHours(startDate.getHours() - 9);
    endDate.setHours(endDate.getHours() - 9);
    endDate.setFullYear(endDate.getFullYear() + 1);
    endDate.setDate(endDate.getDate() + 1);

    const calendars = await CalendarMember.findAll({
      where: { UserId: req.myId },
    });

    var Events = [];
    await Promise.all(
      calendars.map(async (calendar) => {
        var event = await Calendar.findOne({
          where: { id: calendar.CalendarId },
          include: [
            {
              model: Event,
              where: {
                [Op.and]: {
                  [Op.or]: {
                    [Op.or]: {
                      startTime: {
                        [Op.and]: {
                          [Op.gte]: startDate,
                          [Op.lt]: endDate,
                        },
                      },
                      endTime: {
                        [Op.and]: {
                          [Op.gte]: startDate,
                          [Op.lt]: endDate,
                        },
                      },
                    },

                    [Op.and]: {
                      startTime: { [Op.lte]: startDate },
                      endTime: { [Op.gte]: endDate },
                    },
                  },
                  permission: { [Op.lte]: calendar.authority },
                },
              },
              separate: true,
            },
          ],
        });
        Events = Events.concat(event.Events.length > 0 ? event.Events : []);
      })
    );

    const myCalendar = await Calendar.findOne({
      where: {
        [Op.and]: {
          private: true,
          OwnerId: req.myId,
        },
      },
    });

    const childEvent = await ChildEvent.findAll({
      where: {
        [Op.and]: {
          [Op.or]: {
            [Op.or]: {
              startTime: {
                [Op.and]: {
                  [Op.gte]: startDate,
                  [Op.lt]: endDate,
                },
              },
              endTime: {
                [Op.and]: {
                  [Op.gte]: startDate,
                  [Op.lt]: endDate,
                },
              },
            },

            [Op.and]: {
              startTime: { [Op.lte]: startDate },
              endTime: { [Op.gte]: endDate },
            },
          },
          privateCalendarId: myCalendar.id,
        },
      },
    });

    Events = Events.concat(childEvent ? childEvent : []);
    Events = Events.sort((a, b) => {
      var a = new Date(a.startTime);
      var b = new Date(b.startTime);
      return a - b;
    });
    return res.status(200).send(Events);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/getAllEvent", authJWT, async (req, res, next) => {
  try {
    var startDate = new Date(req.body.startDate);
    var endDate = new Date(req.body.endDate);

    startDate.setHours(startDate.getHours() - 9);
    endDate.setHours(endDate.getHours() - 9);
    endDate.setDate(endDate.getDate() + 1);

    const calendars = await CalendarMember.findAll({
      where: { UserId: req.myId },
    });

    var Events = [];
    await Promise.all(
      calendars.map(async (calendar) => {
        var event = await Calendar.findOne({
          where: { id: calendar.CalendarId },
          include: [
            {
              model: Event,
              where: {
                [Op.and]: {
                  [Op.or]: {
                    [Op.or]: {
                      startTime: {
                        [Op.and]: {
                          [Op.gte]: startDate,
                          [Op.lt]: endDate,
                        },
                      },
                      endTime: {
                        [Op.and]: {
                          [Op.gte]: startDate,
                          [Op.lt]: endDate,
                        },
                      },
                    },

                    [Op.and]: {
                      startTime: { [Op.lte]: startDate },
                      endTime: { [Op.gte]: endDate },
                    },
                  },
                  permission: { [Op.lte]: calendar.authority },
                },
              },
              separate: true,
            },
          ],
        });

        const addAuthority = JSON.parse(JSON.stringify(event));
        addAuthority.authority = calendar.authority;

        Events.push(addAuthority);
      })
    );

    const myCalendar = await Calendar.findOne({
      where: {
        [Op.and]: {
          private: true,
          OwnerId: req.myId,
        },
      },
    });

    const childEvent = await ChildEvent.findAll({
      attributes: [
        "id",
        "name",
        "color",
        "busy",
        "memo",
        "startTime",
        "endTime",
        "allDay",
        "state",
        ["privateCalendarId", "CalendarId"],
      ],
      where: {
        [Op.and]: {
          [Op.or]: {
            [Op.or]: {
              startTime: {
                [Op.and]: {
                  [Op.gte]: startDate,
                  [Op.lt]: endDate,
                },
              },
              endTime: {
                [Op.and]: {
                  [Op.gte]: startDate,
                  [Op.lt]: endDate,
                },
              },
            },

            [Op.and]: {
              startTime: { [Op.lte]: startDate },
              endTime: { [Op.gte]: endDate },
            },
          },
          privateCalendarId: myCalendar.id,
        },
      },
    });

    return res.status(200).send({ events: Events, childEvents: childEvent });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/getEvent", authJWT, async (req, res, next) => {
  try {
    if (typeof req.body.eventId != "number") {
      const getChild = await ChildEvent.findOne({
        where: { id: req.body.eventId },
        attributes: [
          "id",
          "name",
          "color",
          "busy",
          "memo",
          "startTime",
          "endTime",
          "allDay",
          "state",
          "originCalendarId",
          ["privateCalendarId", "CalendarId"],
          "ParentEventId",
        ],
      });

      const getParent = await Event.findOne({
        where: { id: getChild.ParentEventId },
        include: [
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
          {
            model: User,
            as: "Host",
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

      const event = JSON.parse(JSON.stringify(getChild));
      event.eventHostEmail = getParent.eventHostEmail;
      event.EventMembers = getParent.EventMembers;
      event.Host = getParent.Host;

      if (!event) {
        return res.status(400).send({ message: "존재하지 않는 이벤트 입니다" });
      }
      return res.status(200).send(event);
    } else {
      const event = await Event.findOne({
        where: { id: req.body.eventId },
        include: [
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
          {
            model: User,
            as: "Host",
            attributes: ["id", "email", "nickname"],
            include: [
              {
                model: ProfileImage,
                attributes: ["src"],
              },
            ],
          },
          {
            model: RealTimeAlert,
          },
        ],
      });

      if (!event) {
        return res.status(400).send({ message: "존재하지 않는 이벤트 입니다" });
      }
      return res.status(200).send(event);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/createEvent", authJWT, async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const me = await User.findOne({
      where: {
        id: req.myId,
      },
    });

    // 자신의 캘린더거나, 그룹 캘린더에 속해 있는지 확인
    const isGroupMember = await CalendarMember.findOne({
      where: {
        [Op.and]: { UserId: req.myId, CalendarId: req.body.calendarId },
      },
    });

    if (!isGroupMember) {
      return res
        .status(400)
        .send({ message: "캘린더의 멤버만 이벤트를 생성할 수 있습니다." });
    }

    const newEvent = await Event.create(
      {
        name: req.body.eventName,
        color: req.body.color ? req.body.color : null,
        busy: req.body.busy,
        permission: req.body.permission ? req.body.permission : 0,
        memo: req.body.memo,
        startTime: new Date(req.body.startTime),
        endTime: new Date(req.body.endTime),
        allDay: req.body.allDay,
        eventHostEmail: me.email,
        CalendarId: req.body.calendarId,
        HostId: req.myId,
      },
      { transaction: t }
    );

    const isPrivateEvent = await Calendar.findOne({
      where: {
        [Op.and]: {
          id: req.body.calendarId,
          private: 1,
          OwnerId: req.myId,
        },
      },
    });

    //개인 이벤트인 경우 자신은 참여 못하게함
    if (isPrivateEvent) {
      req.body.guests = req.body.guests.filter((x) => x !== req.myId);
    }

    if (req.body.guests.length > 0) {
      await Promise.all(
        req.body.guests.map(async (guestId) => {
          await EventMember.create(
            {
              UserId: guestId,
              EventId: newEvent.id,
            },
            {
              transaction: t,
            }
          );

          const guestCalendar = await Calendar.findOne({
            where: {
              [Op.and]: {
                private: true,
                OwnerId: guestId,
              },
            },
          });

          await ChildEvent.create(
            {
              id: short.generate(),
              name: newEvent.name,
              color: newEvent.color,
              busy: newEvent.busy,
              memo: newEvent.memo,
              allDay: newEvent.allDay,
              startTime: newEvent.startTime,
              endTime: newEvent.endTime,
              ParentEventId: newEvent.id,
              privateCalendarId: guestCalendar.id,
              originCalendarId: newEvent.CalendarId,
              state: 0,
            },
            { transaction: t }
          );

          if (guestId !== req.myId) {
            await Alert.create(
              {
                UserId: guestId,
                type: "event",
                calendarId: req.body.calendarId,
                eventDate: newEvent.startTime,
                content: `${newEvent.name} 이벤트에 초대되었습니다!`,
              },
              { transaction: t }
            );
          }
        })
      );
    }

    if (req.body.alerts.length > 0) {
      if (req.body.allDay === 1) {
        await Promise.all(
          req.body.alerts.map(async (alert) => {
            if (alert.type === "day") {
              const content = `${req.body.eventName}시작 ${alert.time}일 전 입니다`;
              const date = new Date(newEvent.startTime);
              date.setDate(date.getDate() - alert.time);
              date.setHours(alert.hour);
              date.setMinutes(parseInt(alert.minute ? alert.minute : 0));

              await addAlert(
                req.myId,
                newEvent.id,
                req.body.calendarId,
                req.body.allDay,
                alert.type,
                alert.time,
                alert.hour,
                alert.minute,
                content,
                date,
                t,
                req.app.get("io"),
                req.app.get("onlineUsers")
              );
            } else if (alert.type === "week") {
              const content = `${req.body.eventName}시작 ${alert.time}주 전 입니다`;
              const date = new Date(req.body.startTime);
              date.setDate(date.getDate() - alert.time * 7);
              date.setHours(alert.hour);
              date.setMinutes(parseInt(alert.minute ? alert.minute : 0));

              await addAlert(
                req.myId,
                newEvent.id,
                req.body.calendarId,
                req.body.allDay,
                alert.type,
                alert.time,
                alert.hour,
                alert.minute,
                content,
                date,
                t,
                req.app.get("io"),
                req.app.get("onlineUsers")
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
                newEvent.id,
                req.body.calendarId,
                req.body.allDay,
                alert.type,
                alert.time,
                null,
                null,
                content,
                date,
                t,
                req.app.get("io"),
                req.app.get("onlineUsers")
              );
            } else if (alert.type === "hour") {
              const content = `${req.body.eventName}시작 ${alert.time}시간 전입니다!`;
              const date = new Date(req.body.startTime);

              date.setHours(date.getHours() - parseInt(alert.time));
              await addAlert(
                req.myId,
                newEvent.id,
                req.body.calendarId,
                req.body.allDay,
                alert.type,
                alert.time,
                null,
                null,
                content,
                date,
                t,
                req.app.get("io"),
                req.app.get("onlineUsers")
              );
            } else if (alert.type === "day") {
              const content = `${req.body.eventName}시작 ${alert.time}일 전입니다!`;
              const date = new Date(req.body.startTime);
              date.setDate(date.getDate() - parseInt(alert.time));
              await addAlert(
                req.myId,
                newEvent.id,
                req.body.calendarId,
                req.body.allDay,
                alert.type,
                alert.time,
                null,
                null,
                content,
                date,
                t,
                req.app.get("io"),
                req.app.get("onlineUsers")
              );
            } else if (alert.type === "week") {
              const content = `${req.body.eventName}시작 ${alert.time}주 전입니다!`;
              const date = new Date(req.body.startTime);
              date.setDate(date.getDate() - parseInt(alert.time) * 7);
              await addAlert(
                req.myId,
                newEvent.id,
                req.body.calendarId,
                req.body.allDay,
                alert.type,
                alert.time,
                null,
                null,
                content,
                date,
                t,
                req.app.get("io"),
                req.app.get("onlineUsers")
              );
            }
          })
        );
      }
    }

    await t.commit();
    return res.status(200).send(newEvent);
  } catch (error) {
    if (t) await t.rollback();
    console.error(error);
    next(error);
  }
});

// childEvent에선 초대만 할 수 있고 없앨 순 없다.
router.post("/editEvent", authJWT, async (req, res, next) => {
  const t = await sequelize.transaction();
  var startTime = new Date(req.body.startTime);
  var endTime = new Date(req.body.endTime);

  // 개인 캘린더에서 주최자는 삭제하지 않는다
  try {
    if (typeof req.body.eventId != "number") {
      const childEvent = await ChildEvent.findOne({
        where: { id: req.body.eventId },
      });

      if (!childEvent) {
        return res
          .status(400)
          .send({ message: "존재하지 않는 이벤트 입니다!" });
      }

      const hasAuthority = await CalendarMember.findOne({
        where: {
          [Op.and]: { UserId: req.myId, CalendarId: req.body.calendarId },
        },
      });

      if (hasAuthority?.authority < 2) {
        return res.status(403).send({ message: "수정 권한이 없습니다!" });
      }

      await childEvent.update(
        {
          name: req.body.eventName,
          color: req.body.color ? req.body.color : null,
          busy: req.body.busy,
          memo: req.body.memo,
          startTime: startTime,
          endTime: endTime,
          allDay: req.body.allDay,
        },
        { transaction: t }
      );

      const originEvent = await Event.findOne({
        where: { id: childEvent.ParentEventId },
      });

      await inviteGuests(originEvent, req.body.guests, true, req.myId, t);

      await deleteChildAlerts(req.myId, req.body.eventId, t);

      if (req.body.alerts.length > 0) {
        if (req.body.allDay === 1) {
          await Promise.all(
            req.body.alerts.map(async (alert) => {
              if (alert.type === "day") {
                const content = `${req.body.eventName}시작 ${alert.time}일 전 입니다`;
                const date = new Date(newEvent.startTime);
                date.setDate(date.getDate() - alert.time);
                date.setHours(alert.hour);
                date.setMinutes(parseInt(alert.minute ? alert.minute : 0));

                await addChildAlert(
                  req.myId,
                  childEvent.id,
                  req.body.calendarId,
                  req.body.allDay,
                  alert.type,
                  alert.time,
                  alert.hour,
                  alert.minute,
                  content,
                  date,
                  t,
                  req.app.get("io"),
                  req.app.get("onlineUsers")
                );
              } else if (alert.type === "week") {
                const content = `${req.body.eventName}시작 ${alert.time}주 전 입니다`;
                const date = new Date(req.body.startTime);
                date.setDate(date.getDate() - alert.time * 7);
                date.setHours(alert.hour);
                date.setMinutes(parseInt(alert.minute ? alert.minute : 0));

                await addChildAlert(
                  req.myId,
                  childEvent.id,
                  req.body.calendarId,
                  req.body.allDay,
                  alert.type,
                  alert.time,
                  alert.hour,
                  alert.minute,
                  content,
                  date,
                  t,
                  req.app.get("io"),
                  req.app.get("onlineUsers")
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
                await addChildAlert(
                  req.myId,
                  childEvent.id,
                  req.body.calendarId,
                  req.body.allDay,
                  alert.type,
                  alert.time,
                  null,
                  null,
                  content,
                  date,
                  t,
                  req.app.get("io"),
                  req.app.get("onlineUsers")
                );
              } else if (alert.type === "hour") {
                const content = `${req.body.eventName}시작 ${alert.time}시간 전입니다!`;
                const date = new Date(req.body.startTime);

                date.setHours(date.getHours() - parseInt(alert.time));
                await addChildAlert(
                  req.myId,
                  childEvent.id,
                  req.body.calendarId,
                  req.body.allDay,
                  alert.type,
                  alert.time,
                  null,
                  null,
                  content,
                  date,
                  t,
                  req.app.get("io"),
                  req.app.get("onlineUsers")
                );
              } else if (alert.type === "day") {
                const content = `${req.body.eventName}시작 ${alert.time}일 전입니다!`;
                const date = new Date(req.body.startTime);
                date.setDate(date.getDate() - parseInt(alert.time));
                await addChildAlert(
                  req.myId,
                  childEvent.id,
                  req.body.calendarId,
                  req.body.allDay,
                  alert.type,
                  alert.time,
                  null,
                  null,
                  content,
                  date,
                  t,
                  req.app.get("io"),
                  req.app.get("onlineUsers")
                );
              } else if (alert.type === "week") {
                const content = `${req.body.eventName}시작 ${alert.time}주 전입니다!`;
                const date = new Date(req.body.startTime);
                date.setDate(date.getDate() - parseInt(alert.time) * 7);
                await addChildAlert(
                  req.myId,
                  childEvent.id,
                  req.body.calendarId,
                  req.body.allDay,
                  alert.type,
                  alert.time,
                  null,
                  null,
                  content,
                  date,
                  t,
                  req.app.get("io"),
                  req.app.get("onlineUsers")
                );
              }
            })
          );
        }
      }

      await t.commit();
      return res.status(200).send(childEvent);
    } else {
      var event = await Event.findOne({
        where: { id: req.body.eventId },
      });

      if (!event) {
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

      const originEvent = await event.update(
        {
          name: req.body.eventName,
          color: req.body.color ? req.body.color : null,
          busy: req.body.busy,
          permission: req.body.permission,
          memo: req.body.memo,
          startTime: startTime,
          endTime: endTime,
          allDay: req.body.allDay,
          CalendarId: req.body.calendarId,
        },
        { transaction: t }
      );

      //개인 이벤트인 경우 자신은 참여 못하게함
      const isPrivateEvent = await Calendar.findOne({
        where: {
          [Op.and]: {
            id: req.body.calendarId,
            private: 1,
            OwnerId: req.myId,
          },
        },
      });

      if (isPrivateEvent) {
        req.body.guests = req.body.guests.filter((x) => x !== req.myId);
      }

      await inviteGuests(originEvent, req.body.guests, false, req.myId, t);

      await deleteAlerts(req.myId, req.body.eventId, t);

      if (req.body.alerts.length > 0) {
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
                  originEvent.id,
                  req.body.calendarId,
                  req.body.allDay,
                  alert.type,
                  alert.time,
                  alert.hour,
                  alert.minute,
                  content,
                  date,
                  t,
                  req.app.get("io"),
                  req.app.get("onlineUsers")
                );
              } else if (alert.type === "week") {
                const content = `${req.body.eventName}시작 ${alert.time}주 전 입니다`;
                const date = new Date(req.body.startTime);
                date.setDate(date.getDate() - alert.time * 7);
                date.setHours(alert.hour);
                date.setMinutes(parseInt(alert.minute ? alert.minute : 0));

                await addAlert(
                  req.myId,
                  originEvent.id,
                  req.body.calendarId,
                  req.body.allDay,
                  alert.type,
                  alert.time,
                  alert.hour,
                  alert.minute,
                  content,
                  date,
                  t,
                  req.app.get("io"),
                  req.app.get("onlineUsers")
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
                  originEvent.id,
                  req.body.calendarId,
                  req.body.allDay,
                  alert.type,
                  alert.time,
                  null,
                  null,
                  content,
                  date,
                  t,
                  req.app.get("io"),
                  req.app.get("onlineUsers")
                );
              } else if (alert.type === "hour") {
                const content = `${req.body.eventName}시작 ${alert.time}시간 전입니다!`;
                const date = new Date(req.body.startTime);

                date.setHours(date.getHours() - parseInt(alert.time));
                await addAlert(
                  req.myId,
                  originEvent.id,
                  req.body.calendarId,
                  req.body.allDay,
                  alert.type,
                  alert.time,
                  null,
                  null,
                  content,
                  date,
                  t,
                  req.app.get("io"),
                  req.app.get("onlineUsers")
                );
              } else if (alert.type === "day") {
                const content = `${req.body.eventName}시작 ${alert.time}일 전입니다!`;
                const date = new Date(req.body.startTime);
                date.setDate(date.getDate() - parseInt(alert.time));
                await addAlert(
                  req.myId,
                  originEvent.id,
                  req.body.calendarId,
                  req.body.allDay,
                  alert.type,
                  alert.time,
                  null,
                  null,
                  content,
                  date,
                  t,
                  req.app.get("io"),
                  req.app.get("onlineUsers")
                );
              } else if (alert.type === "week") {
                const content = `${req.body.eventName}시작 ${alert.time}주 전입니다!`;
                const date = new Date(req.body.startTime);
                date.setDate(date.getDate() - parseInt(alert.time) * 7);
                await addAlert(
                  req.myId,
                  originEvent.id,
                  req.body.calendarId,
                  req.body.allDay,
                  alert.type,
                  alert.time,
                  null,
                  null,
                  content,
                  date,
                  t,
                  req.app.get("io"),
                  req.app.get("onlineUsers")
                );
              }
            })
          );
        }
      }

      await t.commit();
      return res.status(200).send(event);
    }
  } catch (error) {
    if (t) await t.rollback();
    console.error(error);
    next(error);
  }
});

router.post("/editEventColor", authJWT, async (req, res, next) => {
  try {
    var event;
    if (typeof req.body.eventId != "number") {
      event = await ChildEvent.findOne({
        where: { id: req.body.eventId },
      });
    } else {
      event = await Event.findOne({
        where: { id: req.body.eventId },
      });
    }

    if (!event) {
      return res.status(400).send({ message: "존재하지 않는 이벤트 입니다!" });
    }

    const hasAuthority = await CalendarMember.findOne({
      where: {
        [Op.and]: { UserId: req.myId, CalendarId: req.body.calendarId },
      },
    });

    if (hasAuthority.authority < 2) {
      return res.status(402).send({ message: "수정 권한이 없습니다!" });
    }
    await sequelize.transaction(async (t) => {
      await event.update(
        {
          color: req.body.color ? req.body.color : null,
        },
        { transaction: t }
      );
    });

    return res.status(200).send(event);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/inviteCheck", authJWT, async (req, res, next) => {
  try {
    const calendar = await Calendar.findOne({
      where: { id: req.body.calendarId },
    });

    var guests = [];
    await Promise.all(
      req.body.guests.map(async (guestEmail) => {
        const guest = await User.findOne({
          where: { email: guestEmail },
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
          return guests.push({
            guest: { email: guestEmail },
            message: "존재하지 않는 유저입니다!",
            canInvite: false,
          });
        }

        // 그룹 캘린더의 이벤트인 경우
        if (!calendar.private) {
          const isGroupMember = await CalendarMember.findOne({
            where: {
              [Op.and]: { UserId: guest.id, CalendarId: req.body.calendarId },
            },
          });

          if (!isGroupMember) {
            return guests.push({
              guest: guest,
              message: "그룹 캘린더에 존재하지 않는 유저입니다!",
              canInvite: false,
            });
          }
        }

        const event = await Event.findOne({
          where: { id: req.body.eventId },
        });

        const alreadyEventMember = await EventMember.findOne({
          where: {
            [Op.and]: { UserId: guest.id, EventId: event.id },
          },
        });

        if (alreadyEventMember) {
          return guests.push({
            guest: guest,
            state: alreadyEventMember.state,
            message: "이미 이벤트의 멤버입니다!",
            canInvite: true,
          });
        }

        return guests.push({
          guest: guest,
          canInvite: true,
        });
      })
    );

    return res.status(200).send(guests);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/inviteCheckBeforeCreate", authJWT, async (req, res, next) => {
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

    const calendar = await Calendar.findOne({
      where: { id: req.body.calendarId },
    });

    // 그룹 캘린더의 이벤트인 경우
    if (!calendar.private) {
      const isGroupMember = await CalendarMember.findOne({
        where: {
          [Op.and]: { UserId: guest.id, CalendarId: req.body.calendarId },
        },
      });
      if (!isGroupMember) {
        return res.status(400).send({
          message: "그룹 캘린더에 존재하지 않는 유저입니다!",
          canInvite: false,
        });
      }
    }

    return res.status(200).send({ guest, canInvite: true });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/changeEventInviteState", authJWT, async (req, res, next) => {
  try {
    const childEvent = await ChildEvent.findOne({
      where: { id: req.body.eventId },
    });

    if (!childEvent) {
      return res.status(400).send({ message: "존재하지 않는 이벤트 입니다!" });
    }

    await sequelize.transaction(async (t) => {
      await EventMember.update(
        { state: req.body.state },
        {
          where: {
            [Op.and]: {
              UserId: req.myId,
              EventId: childEvent.ParentEventId,
            },
          },
          transaction: t,
        }
      );

      await childEvent.update(
        {
          state: req.body.state,
        },
        {
          transaction: t,
        }
      );
    });

    return res.status(200).send({ success: true });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/deleteEvent", authJWT, async (req, res, next) => {
  try {
    var event;
    if (typeof req.body.eventId !== "number") {
      event = await ChildEvent.findOne({
        where: { id: req.body.eventId },
      });
    } else {
      event = await Event.findOne({
        where: { id: req.body.eventId },
      });
    }

    if (!event) {
      return res.status(400).send({ message: "존재하지 않는 이벤트 입니다!" });
    }

    const hasAuthority = await CalendarMember.findOne({
      where: {
        [Op.and]: { UserId: req.myId, CalendarId: req.body.calendarId },
      },
    });

    if (hasAuthority.authority < 2) {
      return res.status(403).send({ message: "삭제 권한이 없습니다!" });
    }

    await sequelize.transaction(async (t) => {
      if (typeof req.body.eventId !== "number") {
        await ChildEvent.destroy({
          where: { id: req.body.eventId },
          force: true,
          transaction: t,
        });
      } else {
        await Event.destroy({
          where: { id: req.body.eventId },
          force: true,
          transaction: t,
        });
      }
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

    const calendars = await CalendarMember.findAll({
      where: { UserId: req.myId },
    });

    var Events = [];
    await Promise.all(
      calendars.map(async (calendar) => {
        var event = await Calendar.findOne({
          where: { id: calendar.CalendarId },
          include: [
            {
              model: Event,
              where: {
                [Op.and]: {
                  name: { [Op.like]: "%" + searchWord + "%" },
                  permission: { [Op.lte]: calendar.authority },
                },
              },
              separate: true,
            },
          ],
        });
        Events = Events.concat(event.Events.length > 0 ? event.Events : []);
      })
    );

    const myCalendar = await Calendar.findOne({
      where: {
        [Op.and]: {
          private: true,
          OwnerId: req.myId,
        },
      },
    });

    const childEvent = await ChildEvent.findAll({
      where: {
        [Op.and]: {
          name: { [Op.like]: "%" + searchWord + "%" },
          privateCalendarId: myCalendar.id,
        },
      },
    });

    Events = Events.concat(childEvent ? childEvent : []);
    // Events = Events.sort((a, b) => {
    //   var a = new Date(a.startTime);
    //   var b = new Date(b.startTime);
    //   return a - b;
    // });
    return res.status(200).send(Events);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// const cron = require("node-cron");

// async function test() {
//   cron.schedule("50 * * * * *", function () {
//     try {
//       console.log("node-cron 실행됨");
//       throw new Error("error on schedule!");
//     } catch (error) {
//       console.error(error);
//     }
//   });
// }

router.get("/test", async (req, res, next) => {
  try {
    var now = new Date();

    return res.status(200).send(now);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// router.get("/test2", async (req, res, next) => {
//   try {
//     cron.schedule("0-59 * * * * *", function () {
//       console.log("node-cron 실행됨");
//     });
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// });

module.exports = router;
