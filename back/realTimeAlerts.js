var cron = require("cron").CronJob;
const { RealTimeAlert } = require("./models");

const addAlert = async (userId, content, date) => {
  try {
    const newAlert = await RealTimeAlert.create({
      UserId: userId,
      content: content,
      date: date,
    });
    const a = cron.scheduleJob(`${newAlert.id}`, date, async () => {
      //여기에 socket을 단다
      console.log("onon");

      //알림을 지운다.
      await RealTimeAlert.destroy({
        where: { id: newAlert.id },
        force: true,
      });
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = addAlert;

// crtl + s로 새로고침을 했을때는 한번만 실행된다 겹치는거 아님
