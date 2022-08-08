var CronJob = require("cron").CronJob;
const { RealTimeAlert, sequelize } = require("./models");
const { Op } = require("sequelize");

let alertsObject = {};
const addAlert = async (userId, eventId, content, date, next) => {
  try {
    await sequelize.transaction(async (t) => {
      const newAlert = await RealTimeAlert.create(
        {
          UserId: userId,
          EventId: eventId,
          content: content,
          date: date,
        },
        {
          transaction: t,
        }
      );

      if (newAlert) {
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
      }
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const deleteAlerts = async (userId, eventId, next) => {
  try {
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
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = { addAlert, deleteAlerts };
