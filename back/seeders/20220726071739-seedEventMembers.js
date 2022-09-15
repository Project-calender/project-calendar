"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    var dummyEventMembers = [];

    var dummyStates = [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 2, 2, 3, 3];
    for (var i = 0; i < 20; i++) {
      for (var j = 0; j < 1000; j++) {
        var eventMember = {
          state: i === 0 ? 1 : dummyStates[Math.floor(Math.random() * 12)],
          UserId: i + 1,
          EventId: j + 1,
        };
        dummyEventMembers.push(eventMember);
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
