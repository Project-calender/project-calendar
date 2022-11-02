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
    db.User.hasMany(db.Calendar, { foreignKey: "OwnerId" });
    db.User.hasMany(db.Event, { foreignKey: "HostId" });

    //Event
    db.User.belongsToMany(db.Event, {
      through: db.EventMember,
    });

    //User
    db.User.belongsToMany(db.User, {
      through: db.Invite,
      as: "Host",
      foreignKey: "guestId",
    });
    db.User.belongsToMany(db.User, {
      through: db.Invite,
      as: "Guest",
      foreignKey: "hostId",
    });

    //ProfileImage
    db.User.hasMany(db.ProfileImage, { onDelete: "CASCADE" });

    //Alert
    db.User.hasMany(db.Alert, { onDelete: "CASCADE" });

    db.User.hasMany(db.RealTimeAlert, { onDelete: "CASCADE" });
  }
};
