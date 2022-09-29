const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class PrivateCalendar extends Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          type: DataTypes.STRING(30),
          allowNull: false,
        },
        color: {
          type: DataTypes.STRING(30),
          defaultValue: "#004a9e",
        },
      },
      {
        modelName: "PrivateCalendar",
        tableName: "PrivateCalendars",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
        timestamps: false,
        sequelize,
      }
    );
  }
  static associate(db) {
    db.PrivateCalendar.belongsTo(db.User);
    db.PrivateCalendar.hasMany(db.Event, {
      as: "PrivateEvents",
      onDelete: "CASCADE",
    });
  }
};
