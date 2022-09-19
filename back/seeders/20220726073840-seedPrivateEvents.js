"use strict";
const { faker } = require("@faker-js/faker");

module.exports = {
  async up(queryInterface, Sequelize) {
    var dummyPrivateEvents = [];

    var allDays = [true, false, false, false, false, false];

    for (var i = 20; i < 50; i++) {
      var startTime = faker.date.between(
        "2021-01-01T00:00:00.000Z",
        "2022-12-30T00:00:00.000Z"
      );
      var endDate = new Date(startTime);
      endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 5));
      var privateEvent = {
        id: i + 1,
        name: faker.word.adjective(),
        color: faker.color.rgb(),
        busy: Math.floor(Math.random() * 2),
        memo: faker.lorem.lines(),
        startTime: startTime,
        endTime: endDate,
        allDay: allDays[Math.floor(Math.random() * 6)],
        PrivateCalendarId: 1,
      };
      dummyPrivateEvents.push(privateEvent);
    }

    await queryInterface.bulkInsert("PrivateEvents", dummyPrivateEvents);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
