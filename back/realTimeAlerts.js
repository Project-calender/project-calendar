var CronJob = require("cron").CronJob;
const { RealTimeAlert, sequelize } = require("./models");
const { Op } = require("sequelize");

let alertsObject = {};
const addAlert = async (userId, eventId, content, date, next) => {
  try {
    await sequelize.transaction(async (t) => {
      const newAlert = await RealTimeAlert.create(
        {
          userId: userId,
          eventId: eventId,
          content: content,
          date: date,
        },
        {
          transaction: t,
        }
      );

      console.log(date);
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
          userId: userId,
          eventId: eventId,
        },
      },
    }).then(async (alerts) => {
      if (alerts.length === 0) return;

      console.log("can");

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

// crtl + s로 새로고침을 했을때는 한번만 실행된다 겹치는거 아님
