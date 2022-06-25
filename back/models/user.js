const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class User extends Model {
  static init(sequelize) {
    return super.init(
      {
        email: {
          type: DataTypes.STRING(30),
          allowNull: false,
          unique: true,
        },
        nickname: {
          type: DataTypes.STRING(30),
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
    db.User.belongsToMany(db.Calendar, { through: "CalendarMembers" });
    db.User.hasMany(db.Calendar, { as: "Owner", foreignKey: "OwnerId" });

    db.User.belongsToMany(db.Event, { through: "EventMembers" });
    db.User.hasMany(db.Event, { as: "EventHost", foreignKey: "EventHostId" });

    db.User.hasMany(db.PrivateCalendar, { as: "MyCalendar" });
    db.User.hasMany(db.PrivateEvent, { as: "MyEvent" });

    db.User.belongsToMany(db.User, {
      through: "Invite",
      as: "CalendarHost",
      foreignKey: "CalendarGuestId",
    });
    db.User.belongsToMany(db.User, {
      through: "Invite",
      as: "CalendarHostGuest",
      foreignKey: "CalendarHostId",
    });
  }
};
