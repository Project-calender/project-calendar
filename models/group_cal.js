module.exports = (sequelize, DataTypes) => {
    const Group_cal = sequelize.define('Group_cal', {
        admin: {
           type: DataTypes.STRING(20),
           allowNull: false, 
        },
        name: {
            type: DataTypes.STRING(30),
            allowNull: false, 
        },
        invited: {
            type: DataTypes.STRING(30),
            allowNull: false, 
        },
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });
    Group_cal.associate = (db) => {
        db.Group_cal.belongsToMany(db.User, { through: 'Group_calUser' })
        db.Group_cal.hasOne(db.Notice_cal)
    };
    return Group_cal;
};