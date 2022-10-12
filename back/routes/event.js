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

// router.post("/getAllEventForYear", authJWT, async (req, res, next) => {
//   try {
//     //시작 날짜 받고 그날 부터 일년 시작날짜 기준
//     const me = await User.findOne({ where: { id: req.myId } });

//     var startDate = new Date(req.body.startTime);
//     var endDate = new Date(startDate);

//     startDate.setHours(startDate.getHours() - 9);
//     endDate.setHours(endDate.getHours() - 9);
//     endDate.setFullYear(endDate.getFullYear() + 1);
//     endDate.setDate(endDate.getDate() + 1);

//     var events = [];
//     const groupCalendars = await me.getGroupCalendars({
//       attributes: [],
//       include: [
//         {
//           model: Event,
//           as: "GroupEvents",
//           where: {
//             [Op.or]: {
//               [Op.or]: {
//                 startTime: {
//                   [Op.and]: {
//                     [Op.gte]: startDate,
//                     [Op.lt]: endDate,
//                   },
//                 },
//                 endTime: {
//                   [Op.and]: {
//                     [Op.gte]: startDate,
//                     [Op.lt]: endDate,
//                   },
//                 },
//               },

//               [Op.and]: {
//                 startTime: { [Op.lte]: startDate },
//                 endTime: { [Op.gte]: endDate },
//               },
//             },
//           },
//         },
//       ],
//       joinTableAttributes: [],
//     });

//     await Promise.all(
//       groupCalendars.map(async (groupCalendar) => {
//         events.push(groupCalendar.GroupEvents);
//       })
//     );

//     const privateEvents = await me.getPrivateCalendar({
//       attributes: [],
//       include: [
//         {
//           model: PrivateEvent,
//           where: {
//             [Op.or]: {
//               [Op.or]: {
//                 startTime: {
//                   [Op.and]: {
//                     [Op.gte]: startDate,
//                     [Op.lt]: endDate,
//                   },
//                 },
//                 endTime: {
//                   [Op.and]: {
//                     [Op.gte]: startDate,
//                     [Op.lt]: endDate,
//                   },
//                 },
//               },

//               [Op.and]: {
//                 startTime: { [Op.lte]: startDate },
//                 endTime: { [Op.gte]: endDate },
//               },
//             },
//           },
//         },
//       ],
//       // order: [[PrivateEvent, "startTime", "ASC"]],
//     });

//     events = events?.flat();
//     if (privateEvents) {
//       events = events.concat(privateEvents?.PrivateEvents);
//     }

//     events = events.sort((a, b) => {
//       var a = new Date(a.startTime);
//       var b = new Date(b.startTime);
//       return a - b;
//     });
//     return res.status(200).send(events);
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// });

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

    const myCalendar = await Calendar.findOne({
      where: {
        [Op.and]: {
          private: true,
          OwnerId: req.myId,
        },
      },
    });

    var Events = [];
    await Promise.all(
      calendars.map(async (calendar) => {
        var event = await Calendar.findOne({
          where: { id: calendar.CalendarId },
          include: [
            {
              model: Event,

              include: [
                {
                  model: ChildEvent,
                  where: {
                    privateCalendarId: myCalendar.id,
                  },
                  separate: true,
                },
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

    return res.status(200).send(Events);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/getEvent", authJWT, async (req, res, next) => {
  try {
    const events = await Event.findOne({
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
      ],
    });

    if (!events) {
      return res.status(400).send({ message: "존재하지 않는 이벤트 입니다" });
    }

    return res.status(200).send(events);
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

    if (isPrivateEvent) {
      // 개인 이벤트인 경우 자신은 바로 참여
      await EventMember.create(
        {
          UserId: req.myId,
          EventId: newEvent.id,
        },
        {
          transaction: t,
        }
      );
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
    await t.commit();
    return res.status(200).send(newEvent);
  } catch (error) {
    if (t) await t.rollback();
    console.error(error);
    next(error);
  }
});

router.post("/editEvent", authJWT, async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const event = await Event.findOne({
      where: { id: req.body.eventId },
    });

    if (!event) {
      return res.status(400).send({ message: "존재하지 않는 이벤트 입니다!" });
    }

    const hasAuthority = await CalendarMember.findOne({
      where: {
        [Op.and]: { UserId: req.myId, CalendarId: req.body.calendarId },
      },
    });

    if (hasAuthority.authority < 2) {
      return res.status(403).send({ message: "수정 권한이 없습니다!" });
    }

    var startTime = new Date(req.body.startTime);
    var endTime = new Date(req.body.endTime);

    await event.update(
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
      var members = [];

      await EventMember.findAll({
        where: {
          EventId: event.eventId,
        },
      }).then((membersInfo) => {
        membersInfo.map((member) => {
          member.push(member.UserId);
        });
      });

      var newMembers = req.body.guests.filter((x) => !members.includes(x));
      var outMembers = members.filter((x) => !guests.includes(x));
      var originMembers = members.filter((x) => !outMembers.includes(x));

      // 기존 멤버들은 childEvent를 업데이트 시켜주어야함
      await Promise.all(
        originMembers.map(async (originMemberId) => {
          const guest = await User.findOne({
            where: { id: originMemberId },
          });

          if (guest) {
            const memberCalendar = await Calendar.findOne({
              where: {
                [Op.and]: {
                  private: true,
                  OwnerId: originMemberId,
                },
              },
            });
            await ChildEvent.update(
              {
                name: req.body.eventName,
                color: req.body.color ? req.body.color : null,
                busy: req.body.busy,
                memo: req.body.memo,
                startTime: startTime,
                endTime: endTime,
                allDay: req.body.allDay,
                originCalendarId: req.body.calendarId,
              },
              {
                where: {
                  [Op.and]: {
                    privateCalendarId: memberCalendar.id,
                    ParentEventId: event.id,
                  },
                },
              }
            );
          }
        })
      );

      await Promise.all(
        newMembers.map(async (newMemberId) => {
          const guest = await User.findOne({
            where: { id: newMemberId },
          });

          if (guest) {
            const guestCalendar = await Calendar.findOne({
              where: {
                [Op.and]: {
                  private: true,
                  OwnerId: newMemberId,
                },
              },
            });

            await ChildEvent.create(
              {
                id: short.generate(),
                name: event.name,
                color: event.color,
                busy: event.busy,
                memo: event.memo,
                allDay: event.allDay,
                startTime: event.startTime,
                endTime: event.endTime,
                ParentEventId: event.id,
                privateCalendarId: guestCalendar.id,
                originCalendarId: event.CalendarId,
                state: 0,
              },
              { transaction: t }
            );

            if (newMemberId !== req.myId) {
              await Alert.create(
                {
                  UserId: newMemberId,
                  type: "event",
                  calendarId: req.body.calendarId,
                  eventDate: event.startTime,
                  content: `${event.name} 이벤트에 초대되었습니다!`,
                },
                { transaction: t }
              );
            }
          }
        })
      );

      await Promise.all(
        outMembers.map(async (outMemberId) => {
          const outMember = await User.findOne({
            where: { id: outMemberId },
          });

          if (outMember) {
            await EventMember.destroy({
              where: {
                [Op.and]: {
                  UserId: outMemberId,
                  EventId: event.id,
                },
              },
              transaction: t,
              force: true,
            });

            const guestCalendar = await Calendar.findOne({
              where: {
                [Op.and]: {
                  private: true,
                  OwnerId: guestId,
                },
              },
            });

            await ChildEvent.destroy({
              where: {
                [Op.and]: {
                  ParentEventId: event.id,
                  CalendarId: guestCalendar.id,
                },
              },
            });

            await Alert.create(
              {
                UserId: outMemberId,
                type: "event",
                calendarId: req.body.calendarId,
                eventDate: event.startTime,
                content: `${event.name} 이벤트에서 강퇴되셨습니다!`,
              },
              { transaction: t }
            );
          }
        })
      );
    }
    await t.commit();
    return res.status(200).send(event);
  } catch (error) {
    if (t) await t.rollback();
    console.error(error);
    next(error);
  }
});

router.post("/editEventColor", authJWT, async (req, res, next) => {
  try {
    const event = await Event.findOne({
      where: { id: req.body.eventId },
    });

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
      await groupEvent.update(
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
    const me = await User.findOne({ where: { id: req.myId } });

    const groupEvent = await Event.findOne({
      where: { id: req.body.eventId },
    });

    if (!groupEvent) {
      return res.status(400).send({ message: "존재하지 않는 이벤트 입니다!" });
    }

    await sequelize.transaction(async (t) => {
      await EventMember.update(
        { state: req.body.state },
        {
          where: {
            [Op.and]: {
              UserId: req.myId,
              EventId: invitedEvent.id,
            },
          },
          transaction: t,
        }
      );

      const myCalendar = await Calendar.findOne({
        where: {
          [Op.and]: {
            private: true,
            OwnerId: req.myId,
          },
        },
      });

      await ChildEvent.update(
        {
          state: req.body.state,
        },
        {
          where: {
            [Op.and]: {
              privateCalendarId: myCalendar.id,
              ParentEventId: req.body.eventId,
            },
          },
          transaction: t,
        }
      );

      //자기한테까지 알림 가는거 막기
      const members = await Event.getEventMembers();
      if (req.body.state === 1) {
        await Promise.all(
          members.map(async (member) => {
            if (member.id !== me.id) {
              await Alert.create(
                {
                  UserId: member.id,
                  type: "event",
                  calendarId: groupEvent.CalendarId,
                  eventDate: groupEvent.startTime,
                  content: `${me.nickname}님이 ${groupEvent.name}이벤트에 참여했어요!`,
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
                  calendarId: groupEvent.CalendarId,
                  eventDate: groupEvent.startTime,
                  content: `${me.nickname}님이 ${groupEvent.name}이벤트 참여를 취소했어요!!`,
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

router.post("/deleteEvent", authJWT, async (req, res, next) => {
  const event = await Event.findOne({
    where: { id: req.body.eventId },
  });

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
    await Event.destroy({
      where: { id: req.body.eventId },
      force: true,
      transaction: t,
    });
  });

  return res.status(200).send({ success: true });
});

router.post("/editChildEvent", authJWT, async (req, res, next) => {
  try {
    const childEvent = await ChildEvent.findOne({
      where: { id: req.body.eventId },
    });

    if (!childEvent) {
      return res.status(400).send({ message: "존재하지 않는 이벤트 입니다!" });
    }

    await sequelize.transaction(async (t) => {
      await childEvent.update(
        {
          name: req.body.eventName,
          color: req.body.color,
          busy: req.body.busy,
          memo: req.body.memo,
          allDay: req.body.allDay,
          startTime: req.body.startTime,
          endTime: req.body.endTime,
        },
        { transaction: t }
      );
    });

    return res.status(200).send(childEvent);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/deleteChildEvent", authJWT, async (req, res, next) => {
  try {
    const childEvent = await ChildEvent.findOne({
      where: { id: req.body.eventId },
    });

    if (!childEvent) {
      return res.status(400).send({ message: "존재하지 않는 이벤트 입니다!" });
    }

    await sequelize.transaction(async (t) => {
      await ChildEvent.destroy({
        where: { id: req.body.eventId },
        transaction: t,
      });
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

module.exports = router;
