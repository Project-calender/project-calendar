const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Calendar extends Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          type: DataTypes.STRING(30),
          allowNull: false,
        },
      },
      {
        modelName: "Calendar",
        tableName: "Calendars",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
        sequelize,
      }
    );
  }
  static associate(db) {
    db.Calendar.belongsToMany(db.User, {
      through: "CalendarMembers",
      as: "Members",
    });
    db.Calendar.belongsTo(db.User, { as: "Owner", foreignKey: "OwnerId" });

    db.Calendar.hasMany(db.Event);
  }
};
