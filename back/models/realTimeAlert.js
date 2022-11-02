const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class RealTimeAlert extends Model {
  static init(sequelize) {
    return super.init(
      {
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
        paranoid: true,
        charset: "utf8",
        sequelize,
      }
    );
  }
  static associate(db) {
    db.RealTimeAlert.belongsTo(db.User);
    db.RealTimeAlert.belongsTo(db.Event);
    db.RealTimeAlert.belongsTo(db.ChildEvent);
  }
};
