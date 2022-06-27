const Sequelize = require("sequelize");
const user = require("./user");
const calendar = require("./calendar");
const event = require("./event");
const privateCalendar = require("./privateCalendar");
const privateEvent = require("./privateEvent");

const db = {};
db.User = user;
db.Calendar = calendar;
db.Event = event;
db.PrivateCalendar = privateCalendar;
db.PrivateEvent = privateEvent;

const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

Object.keys(db).forEach((modelName) => {
  console.log(modelName);
  db[modelName].init(sequelize);
});

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
