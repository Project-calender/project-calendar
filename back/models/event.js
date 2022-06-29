const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Event extends Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          type: DataTypes.STRING(30),
          allowNull: false,
          unique: true,
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
      },
      {
        modelName: "Events",
        tableName: "Events",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
        sequelize,
      }
    );
  }
  static associate(db) {
    db.Event.belongsToMany(db.User, { through: "EventMembers", as: "Members" });
    db.Event.belongsTo(db.User, { as: "EventHost", foreignKey: "EventHostId" });

    db.Event.belongsTo(db.Calendar);
  }
};
