var CronJob = require("cron").CronJob;
const { RealTimeAlert, sequelize } = require("./models");
const { Op } = require("sequelize");

let alertsObject = {};
const restartAll = async () => {
  await RealTimeAlert.findAll().then(async (realTimeAlerts) => {
    await Promise.all(
      realTimeAlerts.map(async (realTimeAlert) => {
        alertsObject[realTimeAlert.id] = new CronJob(
          realTimeAlert.date,
          async function () {
            console.log(`${realTimeAlert.content}`);

            await RealTimeAlert.destroy({
              where: { id: realTimeAlert.id },
              // force: true,
            });
          },
          null,
          true
        );
      })
    );
  });
};

const addAlert = async (
  userId,
  eventId,
  calendarId,
  allDay,
  type,
  time,
  hour,
  minute,
  content,
  date,
  myId,
  socket,
  onlineUsers
) => {
  await sequelize.transaction(async (t) => {
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
      console.log("현재 서버 컴퓨터 시작", now);
      console.log("알림 시각", date);

      alertsObject[newAlert.id] = new CronJob(
        date,
        async function () {
          var socketId = Object.keys(onlineUsers).find(
            (key) => onlineUsers[key] === myId
          );

          console.log(socketId);
          // if (socketId) {
          //   socket.to(socketId).emit("alertTest", { alert: content });
          // }
          socket.emit("alertTest", { alert: content });

          await RealTimeAlert.destroy({
            where: { id: newAlert.id },
            force: true,
          });
        },
        null,
        true
      );
    });
  });
};

const addPrivateAlert = async (userId, eventId, content, date) => {
  await sequelize.transaction(async (t) => {
    await RealTimeAlert.create(
      {
        UserId: userId,
        PrivateEventId: eventId,
        content: content,
        date: date,
      },
      { transaction: t }
    ).then((newAlert) => {
      alertsObject[newAlert.id] = new CronJob(
        date,
        async function () {
          console.log(`${content}`);

          await RealTimeAlert.destroy({
            where: { id: newAlert.id },
            force: true,
          });
        },
        null,
        true
      );
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
        alertsObject[alert.id].stop();
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
        alertsObject[alert.id].stop();
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
        alertsObject[alert.id].stop();
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
        alertsObject[alert.id].stop();
      })
    ).then(async () => {
      await RealTimeAlert.destroy({ where: { id: alertIds }, force: true });
    });
  });
};

module.exports = {
  restartAll,
  addAlert,
  addPrivateAlert,
  deleteAlerts,
  deletePrivateAlerts,
  deleteAlertsByEventId,
  deleteAlertsByCalendarId,
};
