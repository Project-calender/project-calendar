var CronJob = require("cron").CronJob;
const { RealTimeAlert, sequelize } = require("./models");
const { Op } = require("sequelize");

let alerts = {};
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

      if (newAlert) {
        alerts[`${newAlert.id}`] = new CronJob(
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

const deleteAlert = async (userId, eventId) => {};

module.exports = { addAlert };

// crtl + s로 새로고침을 했을때는 한번만 실행된다 겹치는거 아님
