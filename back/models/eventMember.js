const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class EventMember extends Model {
  static init(sequelize) {
    return super.init(
      {
        state: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
        }, 
        eventAuthority: {
          type: DataTypes.INTEGER,
          defaultValue: 3
        }
      },
      {
        modelName: "EventMember",
        tableName: "EventMembers",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
        sequelize,
      }
    );
  }
  static associate(db) {}
};
