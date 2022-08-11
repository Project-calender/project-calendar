"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    var calendarMembers = [];

    for (var i = 1; i < 20; i++) {
      for (var j = 0; j < 5; j++) {
        var calendarMember = {
          authority: Math.floor(Math.random() * 3),
          UserId: i + 1,
          CalendarId: j + 1,
        };
        calendarMembers.push(calendarMember);
      }
    }

    await queryInterface.bulkInsert("CalendarMembers", calendarMembers);
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
