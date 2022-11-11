const DataTypes = require("sequelize");

const { Model } = DataTypes;

module.exports = class ChildEvent extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.STRING(40),
          allowNull: false,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING(30),
          allowNull: false,
        },
        color: {
          type: DataTypes.STRING(20),
        },
        busy: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
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
        allDay: {
          type: DataTypes.INTEGER,
        },
        state: {
          type: DataTypes.INTEGER,
          default: 0,
        },
      },
      {
        modelName: "ChildEvent",
        tableName: "ChildEvents",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
        timestamps: false,
        sequelize,
      }
    );
  }
  static associate(db) {
    db.ChildEvent.belongsTo(db.Calendar, { as: "privateCalendar" });
    db.ChildEvent.belongsTo(db.Calendar, { as: "originCalendar" });
    db.ChildEvent.belongsTo(db.Event, {
      as: "ParentEvent",
    });
    db.ChildEvent.hasMany(db.RealTimeAlert, { onDelete: "CASCADE" });
  }
};
