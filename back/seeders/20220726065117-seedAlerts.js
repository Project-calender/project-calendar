"use strict";

const { faker } = require("@faker-js/faker");

module.exports = {
  async up(queryInterface, Sequelize) {
    var dummyAlerts = [];
    var randomType = [
      "event",
      "eventRemoved",
      "calendarInviteReject",
      "calendarInvite",
    ];

    var dummyEventDate = faker.date.between(
      "2022-01-01T00:00:00.000Z",
      "2022-12-31T00:00:00.000Z"
    );

    var dummyDate = faker.date.between(
      "2022-07-01T00:00:00.000Z",
      "2022-07-10T00:00:00.000Z"
    );

    for (var i = 0; i < 97; i++) {
      var alert = {
        id: i + 1,
        type: randomType[Math.floor(Math.random() * 4)],
        content: `알림 no.${i + 1}`,
        eventCalendarId: 1,
        eventDate: dummyEventDate,
        createdAt: dummyDate,
        updatedAt: dummyDate,
        UserId: 1,
      };
      dummyAlerts.push(alert);
    }

    await queryInterface.bulkInsert("Alerts", dummyAlerts);
  },

  async down(queryInterface, Sequelize) {},
};
