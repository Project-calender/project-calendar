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
const { authJWT } = require("../middlewares/auth");
const { inviteGuests, inviteGuestsWhileEdit } = require("../commons/event");

router.post("/getAllEventForYear", authJWT, async (req, res, next) => {
  try {
    //시작 날짜 받고 그날 부터 일년 시작날짜 기준
    const me = await User.findOne({ where: { id: req.myId } });

    var startDate = new Date(req.body.startTime);
    var endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + 1);

    var events = [];
    const groupCalendars = await me.getGroupCalendars({
      attributes: [],
      include: [
        {
          model: Event,
          as: "GroupEvents",
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
        },
      ],
      // order: [["GroupEvents", "startTime", "ASC"]],
      joinTableAttributes: [],
    });

    await Promise.all(
      groupCalendars.map(async (groupCalendar) => {
        events.push(groupCalendar.GroupEvents);
      })
    );

    const privateEvents = await me.getPrivateCalendar({
      attributes: [],
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
        },
      ],
      // order: [[PrivateEvent, "startTime", "ASC"]],
    });

    events = events?.flat();
    if (privateEvents) {
      events = events.concat(privateEvents?.PrivateEvents);
    }

    events = events.sort((a, b) => {
      var a = new Date(a.startTime);
      var b = new Date(b.startTime);
      return a - b;
    });
    return res.status(200).send(events);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/getAllEvent", authJWT, async (req, res, next) => {
  try {
    const me = await User.findOne({ where: { id: req.myId } });
    var startDate = new Date(req.body.startDate);
    var endDate = new Date(req.body.endDate);
    startDate.setHours(startDate.getHours() + 9);
    endDate.setHours(endDate.getHours() + 9);

    // endDate.setDate(endDate.getDate() + 1);

    console.log(startDate);

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
        "allDay",
        "permission",
        "busy",
        "memo",
        "startTime",
        "endTime",
        "eventHostEmail",
        "CalendarId",
      ],
      include: [
        // {
        //   model: User,
        //   as: "EventHost",
        //   attributes: {
        //     exclude: ["password", "checkedCalendar"],
        //   },
        // },
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

    const realTimeAlert = await RealTimeAlert.findAll({
      where: {
        [Op.and]: {
          UserId: req.myId,
          EventId: req.body.eventId,
        },
      },
      paranoid: false,
      attributes:
        events.allDay === 1
          ? ["type", "time", "hour", "minute"]
          : ["type", "time"],
    });
    return res
      .status(200)
      .send({ event: events, realTimeAlert: realTimeAlert });
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
  const t = await sequelize.transaction();
  try {
    const me = await User.findOne({
      where: {
        id: req.myId,
      },
    });
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

    var startTime = new Date(req.body.startTime);
    // startTime.setHours(startTime.getHours() + 9);
    var endTime = new Date(req.body.endTime);
    // endTime.setHours(endTime.getHours() + 9);

    const groupEvent = await Event.create(
      {
        name: req.body.eventName,
        color: req.body.color ? req.body.color : null,
        busy: req.body.busy,
        permission: req.body.permission,
        memo: req.body.memo,
        startTime: startTime,
        endTime: endTime,
        allDay: req.body.allDay,
        eventHostEmail: me.email,
        CalendarId: req.body.calendarId,
      },
      { transaction: t }
    );

    if (req.body.guests.length > 0) {
      await inviteGuests(req.body.guests, groupEvent, req.body.calendarId, t);
    }

    await t.commit();

    return res.status(200).send(groupEvent);
  } catch (error) {
    if (t) await t.rollback();
    console.error(error);
    next(error);
  }
});

router.post("/inviteCheck", authJWT, async (req, res, next) => {
  try {
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

        const groupEvent = await Event.findOne({
          where: { id: req.body.eventId },
        });

        const alreadyEventMember = await EventMember.findOne({
          where: {
            [Op.and]: { UserId: guest.id, EventId: groupEvent.id },
          },
        });
        if (alreadyEventMember) {
          return guests.push({
            guest: guest,
            state: alreadyEventMember.state,
            message: "이미 그룹 이벤트의 멤버입니다!",
            canInvite: true,
          });
        }

        // const alreadyInvite = await EventMember.findOne({
        //   where: {
        //     [Op.and]: { UserId: guest.id, EventId: groupEvent.id },
        //   },
        // });
        // if (alreadyInvite) {
        //   return guests.push({
        //     guest: guest,
        //     message: "이미 초대를 보낸 사람입니다!",
        //     canInvite: false,
        //   });
        // }

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

router.post(
  "/inviteCheckBeforeCreateEvent",
  authJWT,
  async (req, res, next) => {
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

      return res.status(200).send({ guest, canInvite: true });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

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
                  calendarId: invitedEvent.CalendarId,
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
                  calendarId: invitedEvent.CalendarId,
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
  const t = await sequelize.transaction();
  try {
    const groupEvent = await Event.findOne({
      where: { id: req.body.eventId },
    });

    if (!groupEvent) {
      return res.status(400).send({ message: "존재하지 않는 이벤트 입니다!" });
    }

    if (groupEvent.CalendarId !== req.body.calendarId) {
      var members = await groupEvent.getEventMembers();

      await Promise.all(
        members.map(async (member) => {
          console.log(member.id);

          const isCalendarMember = await CalendarMember.findOne({
            where: {
              [Op.and]: {
                UserId: member.id,
                CalendarId: req.body.calendarId,
              },
            },
          });

          if (!isCalendarMember) {
            await EventMember.destroy({
              where: {
                [Op.and]: {
                  UserId: member.id,
                  EventId: groupEvent.id,
                },
              },
            });
          }
        })
      );
    } else {
      const hasAuthority = await CalendarMember.findOne({
        where: {
          [Op.and]: { UserId: req.myId, CalendarId: req.body.calendarId },
        },
      });

      if (hasAuthority.authority < 2) {
        return res.status(403).send({ message: "수정 권한이 없습니다!" });
      }
    }

    var startTime = new Date(req.body.startTime);
    startTime.setHours(startTime.getHours() + 9);
    var endTime = new Date(req.body.endTime);
    endTime.setHours(endTime.getHours() + 9);

    await groupEvent.update(
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

    if (req.body.guests.length > 0) {
      await inviteGuestsWhileEdit(
        req.body.guests,
        groupEvent,
        req.body.eventId,
        req.body.calendarId,
        t
      );
    }

    // await deleteAlerts(req.myId, req.body.eventId);

    await PrivateEvent.update(
      {
        name: req.body.eventName,
        color: req.body.color ? req.body.color : null,
        busy: req.body.busy,
        permission: req.body.permission,
        memo: req.body.memo,
        startTime: startTime,
        endTime: endTime,
        allDay: req.body.allDay,
      },
      {
        where: {
          [Op.and]: {
            groupEventId: req.body.eventId,
          },
        },
        transaction: t,
      }
    );

    await t.commit();
    return res.status(200).send(groupEvent);
  } catch (error) {
    if (t) await t.rollback();
    console.error(error);
    next(error);
  }
});

router.post("/editGroupEventColor", authJWT, async (req, res, next) => {
  try {
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
      return res.status(402).send({ message: "수정 권한이 없습니다!" });
    }
    await sequelize.transaction(async (t) => {
      //'2022-07-26 07:00:18'
      await groupEvent.update(
        {
          color: req.body.color ? req.body.color : null,
        },
        { transaction: t }
      );
    });

    return res.status(200).send(groupEvent);
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

      // const privateCalendar = await me.getPrivateCalendar();
      await PrivateEvent.destroy({
        where: {
          [Op.and]: {
            groupEventId: req.body.eventId,
            // PrivateCalendarId: privateCalendar.id,
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

// 자신이 참여하지 않은 이벤트도 검색되게하고, 개인 이벤트도 검색되게하기
router.post("/searchEvent", authJWT, async (req, res, next) => {
  try {
    const searchWord = req.body.searchWord;

    const me = await User.findOne({ where: { id: req.myId } });

    var events = [];
    const groupCalendars = await me.getGroupCalendars({
      attributes: [],
      include: [
        {
          model: Event,
          as: "GroupEvents",
          where: { name: { [Op.like]: "%" + searchWord + "%" } },
        },
      ],
      joinTableAttributes: [],
    });

    await Promise.all(
      groupCalendars.map(async (groupCalendar) => {
        events.push(groupCalendar.GroupEvents);
      })
    );

    const privateEvents = await me.getPrivateCalendar({
      attributes: [],
      include: [
        {
          model: PrivateEvent,
          where: { name: { [Op.like]: "%" + searchWord + "%" } },
        },
      ],
    });

    events = events?.flat();
    if (privateEvents) {
      events = events.concat(privateEvents?.PrivateEvents);
    }
    return res.status(200).send(events);
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
    var test = [];
    await Promise.all(
      [1, 2, 3].map(async (item) => {
        if (item === 1) {
          return test.push(item);
        }

        console.log(item);
      })
    );

    return res.status(200).send(test);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
