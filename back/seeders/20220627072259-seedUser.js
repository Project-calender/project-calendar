"use strict";

const { faker } = require("@faker-js/faker");
const bcrypt = require("bcrypt");
module.exports = {
  async up(queryInterface, Sequelize) {
    var dummyUser = [];
    for (var i = 0; i < 100; i++) {
      dummyUser.push({
        email: faker.internet.email(),
        nickname: faker.name.findName(),
        password: await bcrypt.hash(faker.random.alpha(10), 12),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await queryInterface.bulkInsert("users", dummyUser);
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
