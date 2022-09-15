"use strict";

const { faker } = require("@faker-js/faker");
const bcrypt = require("bcrypt");
module.exports = {
  async up(queryInterface, Sequelize) {
    var dummyUser = [];
    var dummyProfiles = [];
    for (var i = 0; i < 20; i++) {
      dummyUser.push({
        email: faker.internet.email(),
        nickname: faker.name.findName(),
        password: await bcrypt.hash("1234", 12),
        provider: "local",
      });

      dummyProfiles.push({
        id: i + 1,
        src: "https://baeminback.s3.ap-northeast-2.amazonaws.com/basicProfile.png",
        UserId: i + 1,
      });
    }

    await queryInterface.bulkInsert("Users", dummyUser);
    await queryInterface.bulkInsert("ProfileImages", dummyProfiles);

    var privateCalendars = [];
    var privateCalendar = {
      id: 1,
      name: "testPrivate",
      color: "#1e90ff",
      UserId: 1,
    };
    privateCalendars.push(privateCalendar);
    await queryInterface.bulkInsert("PrivateCalendars", privateCalendars);
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
