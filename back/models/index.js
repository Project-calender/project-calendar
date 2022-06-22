const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.Cal = require('./cal')(sequelize, Sequelize);
db.Event = require('./event')(sequelize, Sequelize);
db.Group_cal = require('./group_cal')(sequelize, Sequelize);
db.Notice_cal = require('./notice_cal')(sequelize, Sequelize);
db.User = require('./user')(sequelize, Sequelize);

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;