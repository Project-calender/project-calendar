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
  ChildEvent,
  RealTimeAlert,
} = require("../models");

const router = express.Router();
const { Op } = require("sequelize");
const { authJWT } = require("../middlewares/auth");
const { inviteGuests, inviteGuestsWhileEdit } = require("../commons/event");

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
              name: newEvent.name,
              color: newEvent.color,
              busy: newEvent.busy,
              memo: newEvent.memo,
              allDay: newEvent.allDay,
              startTime: newEvent.startTime,
              endTime: newEvent.endTime,
              ParentEventId: newEvent.id,
              CalendarId: guestCalendar.id,
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
              CalendarId: myCalendar.id,
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

module.exports = router;
