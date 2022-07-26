"use strict";
const { faker } = require("@faker-js/faker");

module.exports = {
  async up(queryInterface, Sequelize) {
    var dummyEvents = [];
    var dummyPrivateEvents = [];
    var startTime = faker.date.between(
      "2022-07-01T00:00:00.000Z",
      "2022-08-30T00:00:00.000Z"
    );
    var endDate = new Date(startTime);
    endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 5));

    var allDays = [true, false, false, false, false, false];

    for (var i = 0; i < 20; i++) {
      var dummyEvent = {
        id: i + 1,
        name: faker.word.adjective(),
        color: faker.color.rgb(),
        priority: parseInt(faker.random.numeric(), 10),
        memo: faker.lorem.lines(),
        startTime: startTime,
        endTime: endDate,
        allDay: allDays[Math.floor(Math.random() * 6)],
        createdAt: new Date(),
        updatedAt: new Date(),
        EventHostId: 1,
        CalendarId: Math.floor(Math.random() * 5) + 1,
      };
      dummyEvents.push(dummyEvent);

      var privateEvent = {
        id: i + 1,
        name: dummyEvent.name,
        color: dummyEvent.color,
        priority: dummyEvent.priority,
        memo: dummyEvent.memo,
        startTime: dummyEvent.startTime,
        endTime: dummyEvent.endTime,
        allDay: dummyEvent.allDay,
        createdAt: dummyEvent.createdAt,
        updatedAt: dummyEvent.updatedAt,
        groupEventId: dummyEvent.id,
        state: 1,
        PrivateCalendarId: 1,
      };
      dummyPrivateEvents.push(privateEvent);
    }

    await queryInterface.bulkInsert("events", dummyEvents);
    await queryInterface.bulkInsert("privateEvents", dummyPrivateEvents);
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
