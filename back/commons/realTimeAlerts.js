var CronJob = require("cron").CronJob;
const { RealTimeAlert, sequelize } = require("../models");
const { Op } = require("sequelize");

const addAlert = async (
  myId, // 내 아이디
  eventId, // 이벤트 아이디
  calendarId, // 캘린더 아이디
  allDay, // 종일 이벤트인지 T/F
  type,
  time,
  hour,
  minute,
  content, // 알림 내용
  date, // 알림 받을 정확한 시간
  t, // transaction
  socket,
  onlineUsers
) => {
  await RealTimeAlert.create(
    {
      UserId: myId,
      EventId: eventId,
      CalendarId: calendarId,
      allDay: allDay,
      type: type,
      time: time,
      hour: hour,
      minute: minute,
      content: content,
      date: date,
    },
    { transaction: t }
  );

  if (new Date() < date) {
    new CronJob(
      date,
      () => {
        try {
          var socketId = Object.keys(onlineUsers).find(
            (key) => onlineUsers[key] === myId
          );
          if (socketId) {
            socket.to(socketId).emit("alertTest", { alert: content });
          }
        } catch (error) {
          console.error(error);
        }
      },
      null,
      true
    );
  }
};

const addChildAlert = async (
  myId, // 내 아이디
  eventId, // 이벤트 아이디
  calendarId, // 캘린더 아이디
  allDay, // 종일 이벤트인지 T/F
  type,
  time,
  hour,
  minute,
  content, // 알림 내용
  date, // 알림 받을 정확한 시간
  t, // transaction
  socket,
  onlineUsers
) => {
  await RealTimeAlert.create(
    {
      UserId: myId,
      ChildEventId: eventId,
      CalendarId: calendarId,
      allDay: allDay,
      type: type,
      time: time,
      hour: hour,
      minute: minute,
      content: content,
      date: date,
    },
    { transaction: t }
  );

  if (new Date() < date) {
    new CronJob(
      date,
      () => {
        try {
          var socketId = Object.keys(onlineUsers).find(
            (key) => onlineUsers[key] === myId
          );
          if (socketId) {
            socket.to(socketId).emit("alertTest", { alert: content });
          }
        } catch (error) {
          console.error(error);
        }
      },
      null,
      true
    );
  }
};

const deleteAlerts = async (userId, eventId, t) => {
  await RealTimeAlert.destroy({
    where: {
      [Op.and]: {
        UserId: userId,
        EventId: eventId,
      },
    },
    force: true,
    transaction: t,
  });
};

const deleteChildAlerts = async (userId, eventId, t) => {
  await RealTimeAlert.destroy({
    where: {
      [Op.and]: {
        UserId: userId,
        ChildEventId: eventId,
      },
    },
    force: true,
    transaction: t,
  });
};

module.exports = {
  addAlert,
  addChildAlert,
  deleteAlerts,
  deleteChildAlerts,
};
