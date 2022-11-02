const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Event extends Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
        color: {
          type: DataTypes.STRING(20),
        },
        busy: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },
        permission: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },
        memo: {
          type: DataTypes.TEXT,
        },
        startTime: {
          type: DataTypes.DATE,
        },
        endTime: {
          type: DataTypes.DATE,
        },
        allDay: {
          type: DataTypes.INTEGER,
        },
        eventHostEmail: {
          type: DataTypes.STRING(30),
          allowNull: false,
        },
      },
      {
        modelName: "Events",
        tableName: "Events",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
        timestamps: false,
        sequelize,
      }
    );
  }
  static associate(db) {
    db.Event.belongsToMany(db.User, {
      through: db.EventMember,
      as: "EventMembers",
    });

    db.Event.belongsTo(db.User, { as: "Host" });
    db.Event.belongsTo(db.Calendar);
    db.Event.hasMany(db.ChildEvent, {
      onDelete: "CASCADE",
      foreignKey: "ParentEventId",
    });

    db.Event.hasMany(db.RealTimeAlert, { onDelete: "CASCADE" });
  }
};
