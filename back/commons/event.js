const { User, Alert, EventMember, PrivateEvent } = require("../models");
const { Op } = require("sequelize");
const changeCalendar = async () => {
  // 우선 이벤트 참여자들을 모두 가져온다

  await groupEvent.getEventMembers();
};

const inviteGuests = async (guests, groupEvent, calendarId, t) => {
  await Promise.all(
    guests.map(async (guestEmail) => {
      const guest = await User.findOne({
        where: { id: guestEmail },
        transaction: t,
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
          calendarId: calendarId,
          eventDate: groupEvent.startTime,
          content: `${groupEvent.name} 이벤트에 초대되었습니다!`,
        },
        { transaction: t }
      );
    })
  );
};

const inviteGuestsWhileEdit = async (
  guests,
  groupEvent,
  eventId,
  calendarId,
  t
) => {
  var members = [];

  await EventMember.findAll({
    where: {
      EventId: eventId,
    },
  }).then((membersInfo) => {
    membersInfo.map((member) => {
      members.push(member.UserId);
    });
  });

  var newMembers = guests.filter((x) => !members.includes(x));
  var outMembers = members.filter((x) => !guests.includes(x));

  await Promise.all(
    newMembers.map(async (newMemberId) => {
      const guest = await User.findOne({
        where: { id: newMemberId },
      });

      if (guest) {
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
            calendarId: calendarId,
            eventDate: groupEvent.startTime,
            content: `${groupEvent.name} 이벤트에 초대되었습니다!`,
          },
          { transaction: t }
        );
      }
    })
  );

  await Promise.all(
    outMembers.map(async (outMemberId) => {
      const guest = await User.findOne({
        where: { id: outMemberId },
      });

      if (guest) {
        await EventMember.destroy({
          where: {
            [Op.and]: {
              UserId: outMemberId,
              EventId: eventId,
            },
          },
          transaction: t,
          force: true,
        });

        const privateCalendar = await guest.getPrivateCalendar();

        await PrivateEvent.destroy({
          where: {
            [Op.and]: {
              groupEventId: eventId,
              PrivateCalendarId: privateCalendar.id,
            },
          },
          transaction: t,
          force: true,
        });

        await Alert.create(
          {
            UserId: outMemberId,
            type: "event",
            calendarId: calendarId,
            eventDate: groupEvent.startTime,
            content: `${groupEvent.name} 이벤트에서 강퇴되셨습니다!`,
          },
          { transaction: t }
        );
      }
    })
  );
};

module.exports = { inviteGuests, inviteGuestsWhileEdit };
