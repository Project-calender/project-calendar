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
const short = require("short-uuid");
const { Op } = require("sequelize");

const inviteGuests = async (originEvent, guests, childEvent, myId, t) => {
  var members = [];

  await EventMember.findAll({
    where: {
      EventId: originEvent.id,
    },
  }).then((membersInfo) => {
    membersInfo.map((member) => {
      members.push(member.UserId);
    });
  });

  var newMembers = guests.filter((x) => !members.includes(x));
  var outMembers = members.filter((x) => !guests.includes(x));
  var originMembers = members.filter((x) => !outMembers.includes(x));

  if (childEvent) {
    await Promise.all(
      newMembers.map(async (newMemberId) => {
        console.log(newMemberId);
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

          await EventMember.create(
            {
              state: 0,
              UserId: newMemberId,
              EventId: originEvent.id,
            },
            {
              transaction: t,
            }
          );

          await ChildEvent.create(
            {
              id: short.generate(),
              name: originEvent.name,
              color: originEvent.color,
              busy: originEvent.busy,
              memo: originEvent.memo,
              allDay: originEvent.allDay,
              startTime: originEvent.startTime,
              endTime: originEvent.endTime,
              ParentEventId: originEvent.id,
              privateCalendarId: guestCalendar.id,
              originCalendarId: originEvent.CalendarId,
              state: 0,
            },
            { transaction: t }
          );

          if (newMemberId !== myId) {
            await Alert.create(
              {
                UserId: newMemberId,
                type: "event",
                calendarId: originEvent.CalendarId,
                eventDate: originEvent.startTime,
                content: `${originEvent.name} 이벤트에 초대되었습니다!`,
              },
              { transaction: t }
            );
          }
        }
      })
    );
  } else {
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
              name: originEvent.name,
              color: originEvent.color ? originEvent.color : null,
              busy: originEvent.busy,
              memo: originEvent.memo,
              startTime: originEvent.startTime,
              endTime: originEvent.endTime,
              allDay: originEvent.allDay,
              originCalendarId: originEvent.CalendarId,
            },
            {
              where: {
                [Op.and]: {
                  privateCalendarId: memberCalendar.id,
                  ParentEventId: originEvent.id,
                },
              },
              transaction: t,
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
          await EventMember.create(
            {
              state: 0,
              UserId: newMemberId,
              EventId: originEvent.id,
            },
            {
              transaction: t,
            }
          );

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
              name: originEvent.name,
              color: originEvent.color ? originEvent.color : null,
              busy: originEvent.busy,
              memo: originEvent.memo,
              allDay: originEvent.allDay,
              startTime: originEvent.startTime,
              endTime: originEvent.endTime,
              ParentEventId: originEvent.id,
              privateCalendarId: guestCalendar.id,
              originCalendarId: originEvent.CalendarId,
              state: 0,
            },
            { transaction: t }
          );

          if (newMemberId !== myId) {
            await Alert.create(
              {
                UserId: newMemberId,
                type: "event",
                calendarId: originEvent.CalendarId,
                eventDate: originEvent.startTime,
                content: `${originEvent.name} 이벤트에 초대되었습니다!`,
              },
              { transaction: t }
            );
          }
        }
      })
    );

    console.log(outMembers);
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
                EventId: originEvent.id,
              },
            },
            transaction: t,
            force: true,
          });

          const guestCalendar = await Calendar.findOne({
            where: {
              [Op.and]: {
                private: true,
                OwnerId: outMemberId,
              },
            },
          });

          await ChildEvent.destroy({
            where: {
              [Op.and]: {
                ParentEventId: originEvent.id,
                privateCalendarId: guestCalendar.id,
              },
            },
            transaction: t,
          });

          await Alert.create(
            {
              UserId: outMemberId,
              type: "event",
              calendarId: originEvent.CalendarId,
              eventDate: originEvent.startTime,
              content: `${originEvent.name} 이벤트에서 강퇴되셨습니다!`,
            },
            { transaction: t }
          );
        }
      })
    );
  }
};

module.exports = { inviteGuests };
