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
        },
        password: {
          type: DataTypes.STRING(200),
        },
        snsId: {
          type: DataTypes.STRING(100),
        },
        provider: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
        checkedCalendar: {
          type: DataTypes.STRING(200),
        },
      },
      {
        modelName: "User",
        tableName: "Users",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
        timestamps: false,
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
    db.User.hasOne(db.PrivateCalendar);

    //User
    db.User.belongsToMany(db.User, {
      through: db.Invite,
      as: "CalendarHost",
      foreignKey: "guestId",
    });
    db.User.belongsToMany(db.User, {
      through: db.Invite,
      as: "CalendarHostGuest",
      foreignKey: "hostId",
    });

    //ProfileImage
    db.User.hasMany(db.ProfileImage);

    //Alert
    db.User.hasMany(db.Alert);
  }
};
