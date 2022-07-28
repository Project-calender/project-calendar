"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    var dummyEventMembers = [];

    var dummyStates = [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 2, 2];
    for (var i = 1; i < 20; i++) {
      for (var j = 0; j < 20; j++) {
        var calendarMember = {
          state: dummyStates[Math.floor(Math.random() * 12)],
          createdAt: new Date(),
          updatedAt: new Date(),
          UserId: i + 1,
          EventId: j + 1,
        };
        dummyEventMembers.push(calendarMember);
      }
    }

    await queryInterface.bulkInsert("EventMembers", dummyEventMembers);
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
