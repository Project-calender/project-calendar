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
              force: true,
            });
          },
          null,
          true
        );
      })
    );
  });
};

const addAlert = async (userId, eventId, calendarId, content, date) => {
  await sequelize.transaction(async (t) => {
    await RealTimeAlert.create(
      {
        UserId: userId,
        EventId: eventId,
        CalendarId: calendarId,
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
