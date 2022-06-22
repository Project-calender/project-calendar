module.exports = (sequelize, DataTypes) => {
    const Notice_cal = sequelize.define('Notice_cal', {
        date: {
           type: DataTypes.DATE,
           allowNull: false, 
        },
        what_accepted: {
            type: DataTypes.BOOLEAN,
            allowNull: false, 
        },
      
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });
    Notice_cal.associate = (db) => {
        db.Notice_cal.belongsTo(db.User, { through: 'Inviting' }),
        db.Notice_cal.belongsTo(db.Group_cal, { through: 'Noticefrom' })
    };
    return Notice_cal;
};