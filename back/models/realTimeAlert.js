const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class RealTimeAlert extends Model {
  static init(sequelize) {
    return super.init(
      {
        UserId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        EventId: {
          type: DataTypes.INTEGER,
        },
        PrivateEventId: {
          type: DataTypes.INTEGER,
        },
        CalendarId: {
          type: DataTypes.INTEGER,
        },
        allDay: {
          type: DataTypes.INTEGER,
        },
        type: {
          type: DataTypes.STRING,
        },
        time: {
          type: DataTypes.INTEGER,
        },
        hour: {
          type: DataTypes.INTEGER,
        },
        minute: {
          type: DataTypes.INTEGER,
        },
        content: {
          type: DataTypes.STRING(200),
          allowNull: false,
        },
        date: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      },
      {
        modelName: "RealTimeAlert",
        tableName: "RealTimeAlerts",
        timestamps: false,
        paranoid: true,
        charset: "utf8",
        sequelize,
      }
    );
  }
  static associate(db) {
    // db.RealTimeAlert.belongsTo(db.User, { onDelete: "CASCADE" });
    // db.RealTimeAlert.belongsTo(db.Event, { onDelete: "CASCADE" });
  }
};
