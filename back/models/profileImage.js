const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class ProfileImage extends Model {
  static init(sequelize) {
    return super.init(
      {
        src: {
          type: DataTypes.STRING(200),
          allowNull: false,
        },
      },
      {
        modelName: "ProfileImage",
        tableName: "ProfileImages",
        paranoid: true,
        charset: "utf8",
        timestamps: false,
        sequelize,
      }
    );
  }
  static associate(db) {
    db.ProfileImage.belongsTo(db.User);
  }
};
