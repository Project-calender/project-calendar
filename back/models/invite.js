const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Invite extends Model {
  static init(sequelize) {
    return super.init(
      {
        state: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },
      },
      {
        modelName: "Invite",
        tableName: "Invites",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
        sequelize,
      }
    );
  }
  static associate(db) {}
};
