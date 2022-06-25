"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn("EventMembers", "state", Sequelize.STRING(20));
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
