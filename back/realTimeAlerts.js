var CronJob = require("cron").CronJob;
const { RealTimeAlert, sequelize } = require("./models");
const { Op } = require("sequelize");

let alertsObject = {};

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
  t // transaction
  // socket,
  // onlineUsers
) => {
  await RealTimeAlert.create(
    {
      UserId: userId,
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
  ).then((newAlert) => {
    const now = new Date();
    if (now < date) {
      alertsObject[newAlert.id] = new CronJob(
        date,
        async function () {
          var socketId = Object.keys(onlineUsers).find(
            (key) => onlineUsers[key] === myId
          );

          if (socketId) {
            socket.to(socketId).emit("alertTest", { alert: content });
          }

          await RealTimeAlert.destroy({
            where: { id: newAlert.id },
          });
        },
        null,
        true
      );
    }
  });
};

const addPrivateAlert = async (
  eventId,
  allDay,
  type,
  time,
  hour,
  minute,
  content,
  date,
  userId,
  socket,
  onlineUsers
) => {
  await sequelize.transaction(async (t) => {
    await RealTimeAlert.create(
      {
        UserId: userId,
        PrivateEventId: eventId,
        allDay: allDay,
        type: type,
        time: time,
        hour: hour,
        minute: minute,
        content: content,
        date: date,
      },
      { transaction: t }
    ).then((newAlert) => {
      const now = new Date();
      if (now < date) {
        alertsObject[newAlert.id] = new CronJob(
          date,
          async function () {
            var socketId = Object.keys(onlineUsers).find(
              (key) => onlineUsers[key] === userId
            );

            if (socketId) {
              socket.to(socketId).emit("alertTest", { alert: content });
            }

            await RealTimeAlert.destroy({
              where: { id: newAlert.id },
            });
          },
          null,
          true
        );
      }
    });
  });
};

const deleteAlerts = async (userId, eventId) => {
  await RealTimeAlert.findAll({
    where: {
      [Op.and]: {
        UserId: userId,
        EventId: eventId,
      },
    },
  }).then(async (alerts) => {
    if (alerts.length === 0) return;

    var alertIds = [];
    await Promise.all(
      alerts.map((alert) => {
        alertIds.push(alert.id);
        alertsObject[alert.id]?.stop();
      })
    ).then(async () => {
      await RealTimeAlert.destroy({ where: { id: alertIds }, force: true });
    });
  });
};

const deletePrivateAlerts = async (userId, eventId) => {
  await RealTimeAlert.findAll({
    where: {
      [Op.and]: {
        UserId: userId,
        PrivateEventId: eventId,
      },
    },
  }).then(async (alerts) => {
    if (alerts.length === 0) return;

    var alertIds = [];
    await Promise.all(
      alerts.map((alert) => {
        alertIds.push(alert.id);
        alertsObject[alert.id]?.stop();
      })
    ).then(async () => {
      await RealTimeAlert.destroy({ where: { id: alertIds }, force: true });
    });
  });
};

const deleteAlertsByEventId = async (eventId) => {
  await RealTimeAlert.findAll({
    where: { EventId: eventId },
  }).then(async (alerts) => {
    if (alerts.length === 0) return;

    var alertIds = [];
    await Promise.all(
      alerts.map((alert) => {
        alertIds.push(alert.id);
        alertsObject[alert.id]?.stop();
      })
    ).then(async () => {
      await RealTimeAlert.destroy({ where: { id: alertIds }, force: true });
    });
  });
};

const deleteAlertsByCalendarId = async (calendarId) => {
  await RealTimeAlert.findAll({
    where: { CalendarId: calendarId },
  }).then(async (alerts) => {
    if (alerts.length === 0) return;

    var alertIds = [];
    await Promise.all(
      alerts.map((alert) => {
        alertIds.push(alert.id);
        alertsObject[alert.id]?.stop();
      })
    ).then(async () => {
      await RealTimeAlert.destroy({ where: { id: alertIds }, force: true });
    });
  });
};

module.exports = {
  addAlert,
  addPrivateAlert,
  deleteAlerts,
  deletePrivateAlerts,
  deleteAlertsByEventId,
  deleteAlertsByCalendarId,
};
