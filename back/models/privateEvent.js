const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class PrivateEvent extends Model {
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
        priority: {
          type: DataTypes.INTEGER,
        },
        memo: {
          type: DataTypes.TEXT,
        },
        startTime: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        endTime: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        groupEventId: {
          type: DataTypes.INTEGER,
        },
        state: {
          type: DataTypes.STRING(20),
          default: 0,
        },
        allDay: {
          type: DataTypes.BOOLEAN,
        },
      },
      {
        modelName: "PrivateEvent",
        tableName: "PrivateEvents",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
        sequelize,
      }
    );
  }
  static associate(db) {
    db.PrivateEvent.belongsTo(db.PrivateCalendar);
  }
};
