module.exports = (sequelize, DataTypes) => {
    const Cal = sequelize.define('Cal', {
        admin: {
           type: DataTypes.STRING(30),
           allowNull: false, 
        },
        name: {
            type: DataTypes.STRING(30),
            allowNull: false, 
        }
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });
    Cal.associate = (db) => {
        db.Cal.belongsTo(db.User, { through: "CalUser"})
    };
    return Cal;
};