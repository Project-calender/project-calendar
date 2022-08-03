const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class RealTimeAlert extends Model {
  static init(sequelize) {
    return super.init(
      {
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
    db.RealTimeAlert.belongsTo(db.User);
  }
};