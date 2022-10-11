const Sequelize = require("sequelize");
const user = require("./user");
const calendar = require("./calendar");
const event = require("./event");
const chlidEvent = require("./childEvent");
const calendarMember = require("./calendarMember");
const eventMember = require("./eventMember");
const invite = require("./invite");
const alert = require("./alert");
const profileImage = require("./profileImage");
const realTimeAlert = require("./realTimeAlert");

const db = {};
db.User = user;
db.Calendar = calendar;
db.Event = event;
db.ChildEvent = chlidEvent;
db.CalendarMember = calendarMember;
db.EventMember = eventMember;
db.Invite = invite;
db.Alert = alert;
db.ProfileImage = profileImage;
db.RealTimeAlert = realTimeAlert;

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
