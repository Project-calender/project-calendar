const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class User extends Model {
  static init(sequelize) {
    return super.init(
      {
        email: {
          type: DataTypes.STRING(100),
          allowNull: false,
          unique: true,
        },
        nickname: {
          type: DataTypes.STRING(100),
          allowNull: false,
          unique: true,
        },
        password: {
          type: DataTypes.STRING(200),
          allowNull: false,
        },
      },
      {
        modelName: "User",
        tableName: "Users",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
        sequelize,
      }
    );
  }
  static associate(db) {
    //Calendar
    db.User.belongsToMany(db.Calendar, {
      through: db.CalendarMember,
      as: "GroupCalendars",
    });
    db.User.hasMany(db.Calendar, { as: "Owner", foreignKey: "OwnerId" });

    //Event
    db.User.belongsToMany(db.Event, {
      through: db.EventMember,
      as: "GroupEvents",
    });
    db.User.hasMany(db.Event, { as: "EventHost", foreignKey: "EventHostId" });

    //private
    db.User.hasMany(db.PrivateCalendar, { as: "MyCalendar" });
    db.User.hasMany(db.PrivateEvent, { as: "MyEvent" });

    //User
    db.User.belongsToMany(db.User, {
      through: db.Invite,
      as: "CalendarHost",
      foreignKey: "CalendarGuestId",
    });
    db.User.belongsToMany(db.User, {
      through: db.Invite,
      as: "CalendarHostGuest",
      foreignKey: "CalendarHostId",
    });

    db.User.hasMany(db.Alert);
  }
};
