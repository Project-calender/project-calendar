const db = require(".");

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.STRING(40),
            allowNull: false,
            unique: true,
            primaryKey: true
          },
        paw: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(30),
            allowNull: false, 
        },
        email: {
            type: DataTypes.STRING(30),
            allowNull: false, 
        },
        auto_logged: {
            type: DataTypes.BOOLEAN(),
            allowNull: true, 
        }
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci', 
    });
    User.associate = (db) => {;
    db.User.hasMany(db.Cal)
    db.User.hasOne(db.Notice_cal)
    db.User.hasMany(db.Group_cal)
    db.User.hasMany(db.Event)
    }
    return User;
};