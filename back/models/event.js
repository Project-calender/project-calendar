module.exports = (sequelize, DataTypes) => {
    const Event = sequelize.define('Event', {
        admin: {
           type: DataTypes.STRING(30),
           allowNull: false, 
        },
        belonged_user: {
            type: DataTypes.STRING(30),
            allowNull: false, 
        },
        memo: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        place: {
            type: DataTypes.STRING(40),
            allowNull: false, 
        },
        importance: {
            type: DataTypes.INTEGER,
            allowNull: false, 
        },
        start_time: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        fin_time: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        participant: {
            type: DataTypes.STRING(30),
            allowNull: false, 
        },
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });
    Event.associate = (db) => {
        db.Event.belongsTo(db.User, { through: "EventUser"})
    };
    return Event;
};