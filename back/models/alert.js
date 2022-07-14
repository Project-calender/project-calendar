const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Alert extends Model {
  static init(sequelize) {
    return super.init(
      {
        type: {
          type: DataTypes.STRING(30),
          allowNull: false,
        },
        content: {
          type: DataTypes.STRING(200),
          allowNull: false,
        },
        checked: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        eventCalendarId: {
          type: DataTypes.INTEGER,
        },
        eventDate: {
          type: DataTypes.DATE,
        },
      },
      {
        modelName: "Alert",
        tableName: "Alerts",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
        sequelize,
      }
    );
  }
  static associate(db) {
    db.Alert.belongsTo(db.User);
  }
};
