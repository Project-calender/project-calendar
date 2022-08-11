const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class CalendarMember extends Model {
  static init(sequelize) {
    return super.init(
      {
        authority: {
          type: DataTypes.INTEGER,
          defaultValue: 1,
        },
      },
      {
        modelName: "CalendarMember",
        tableName: "CalendarMembers",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
        timestamps: false,
        sequelize,
      }
    );
  }
  static associate(db) {}
};
