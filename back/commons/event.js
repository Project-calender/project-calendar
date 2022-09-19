const { User, Alert, EventMember } = require("../models");
const { Op } = require("sequelize");
const changeCalendar = async () => {
  // 우선 이벤트 참여자들을 모두 가져온다

  await groupEvent.getEventMembers();
};

const inviteGuests = async (guests, groupEvent, calendarId, t) => {
  await Promise.all(
    guests.map(async (guestEmail) => {
      const guest = await User.findOne({
        where: { email: guestEmail },
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
  await Promise.all(
    guests.map(async (guestEmail) => {
      const guest = await User.findOne({
        where: { email: guestEmail },
      });

      if (guest) {
        const alreadyMember = await EventMember.findOne({
          where: {
            [Op.and]: {
              UserId: guest.id,
              EventId: eventId,
            },
          },
        });

        if (!alreadyMember) {
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
      }
    })
  );
};

module.exports = { inviteGuests, inviteGuestsWhileEdit };
