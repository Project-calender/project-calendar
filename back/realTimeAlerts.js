var CronJob = require("cron").CronJob;
const { RealTimeAlert, sequelize } = require("./models");
const { Op } = require("sequelize");

let alertsObject = {};
const addAlert = async (userId, eventId, content, date) => {
  await sequelize.transaction(async (t) => {
    await RealTimeAlert.create(
      {
        UserId: userId,
        EventId: eventId,
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

module.exports = { addAlert, deleteAlerts };
