const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Calendar extends Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          type: DataTypes.STRING(30),
          allowNull: false,
        },
        color: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
      },
      {
        modelName: "Calendar",
        tableName: "Calendars",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
        timestamps: false,
        sequelize,
      }
    );
  }
  static associate(db) {
    db.Calendar.belongsToMany(db.User, {
      through: db.CalendarMember,
      as: "CalendarMembers",
      onDelete: "CASCADE",
    });
    db.Calendar.belongsTo(db.User, { as: "Owner", onDelete: "CASCADE" });
    db.Calendar.hasMany(db.Invite, {
      as: "HostCalendar",
      foreignKey: "HostCalendarId",
      onDelete: "CASCADE",
    });
    db.Calendar.hasMany(db.Event, { as: "GroupEvents", onDelete: "CASCADE" });
  }
};
