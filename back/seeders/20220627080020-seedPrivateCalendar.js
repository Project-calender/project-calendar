"use strict";
const { faker } = require("@faker-js/faker");

module.exports = {
  async up(queryInterface, Sequelize) {
    var dummyPrivateCalendars = [];
    for (var i = 0; i < 100; i++) {
      var privateCalendar = {
        name: "MyCalendar",
        createdAt: new Date(),
        updatedAt: new Date(),
        UserId: i + 1,
      };
      dummyPrivateCalendars.push(privateCalendar);
    }
    await queryInterface.bulkInsert("privateCalendars", dummyPrivateCalendars);
  },

  async down(queryInterface, Sequelize) {},
};
