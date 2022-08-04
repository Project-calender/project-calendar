var CronJob = require("cron").CronJob;
const { RealTimeAlert } = require("./models");

let alerts = {};
const addAlert = async (userId, content, date) => {
  try {
    const newAlert = await RealTimeAlert.create({
      UserId: userId,
      content: content,
      date: date,
    });
    alerts[`${newAlert.id}`] = new CronJob(
      date,
      async function () {
        console.log("You will see this message every second");

        await RealTimeAlert.destroy({
          where: { id: newAlert.id },
          force: true,
        });
      },
      null,
      true
    );
    console.log("a");
  } catch (error) {
    console.error(error);
  }
};

const deleteAlert = async (userId, eventId) => {};

module.exports = { addAlert };

// crtl + s로 새로고침을 했을때는 한번만 실행된다 겹치는거 아님
