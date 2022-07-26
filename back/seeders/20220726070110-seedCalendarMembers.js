"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    var calendarMembers = [];

    for (var i = 1; i < 20; i++) {
      for (var j = 0; j < 5; j++) {
        var calendarMember = {
          authority: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          UserId: i + 1,
          CalendarId: j + 1,
        };
        calendarMembers.push(calendarMember);
      }
    }

    await queryInterface.bulkInsert("calendarMembers", calendarMembers);
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
