const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class PrivateEvent extends Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          type: DataTypes.STRING(30),
          allowNull: false,
          unique: true,
        },
        color: {
          type: DataTypes.STRING(10),
          allowNull: false,
        },
        priority: {
          type: DataTypes.INTEGER,
        },
        memo: {
          type: DataTypes.TEXT,
        },
        startTime: {
          type: DataTypes.STRING(30),
          allowNull: false,
        },
        endTime: {
          type: DataTypes.STRING(30),
          allowNull: false,
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
    db.PrivateEvent.belongsTo(db.User);
    db.PrivateEvent.belongsTo(db.PrivateCalendar);
  }
};
