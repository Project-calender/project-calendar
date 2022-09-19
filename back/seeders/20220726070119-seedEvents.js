"use strict";
const { faker } = require("@faker-js/faker");

module.exports = {
  async up(queryInterface, Sequelize) {
    var dummyEvents = [];
    var dummyPrivateEvents = [];

    var allDays = [true, false, false, false, false, false];

    for (var i = 0; i < 1000; i++) {
      var startTime = faker.date.between(
        "2021-01-01T00:00:00.000Z",
        "2022-12-30T00:00:00.000Z"
      );
      var endDate = new Date(startTime);
      endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 5));
      var dummyEvent = {
        id: i + 1,
        name: faker.word.adjective(),
        color: faker.color.rgb(),
        busy: Math.floor(Math.random() * 2),
        permission: Math.floor(Math.random() * 2) + 1,
        memo: faker.lorem.lines(),
        startTime: startTime,
        endTime: endDate,
        allDay: allDays[Math.floor(Math.random() * 6)],
        eventHostEmail: "test@naver.com",
        CalendarId: Math.floor(Math.random() * 5) + 1,
      };
      dummyEvents.push(dummyEvent);

      var privateEvent = {
        id: i + 1,
        name: dummyEvent.name,
        color: dummyEvent.color,
        memo: dummyEvent.memo,
        busy: Math.floor(Math.random() * 2),
        startTime: dummyEvent.startTime,
        endTime: dummyEvent.endTime,
        allDay: dummyEvent.allDay,
        groupEventId: dummyEvent.id,
        state: 1,
        PrivateCalendarId: 1,
      };
      dummyPrivateEvents.push(privateEvent);
    }

    await queryInterface.bulkInsert("Events", dummyEvents);
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
