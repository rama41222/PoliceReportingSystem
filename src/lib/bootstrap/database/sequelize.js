const Sequelize = require('sequelize');
const config = require('./../../../config');

const { database } = config;

const sequelize = new Sequelize(database.name, database.username, database.password, {
  host: database.host,
  port: Number(database.port),
  dialect: database.dialect,
  operatorsAliases: database.operatorsAliases,
  logging: database.logging === 1,
  pool: {
    max: database.pool.max,
    min: database.pool.min,
    acquire: database.pool.acquire,
    idle: database.pool.idle,
  },
});

async function connect() {
  return sequelize
    .authenticate()
    .then(() => {
      console.log('Database connection has been established successfully.');
    })
    .catch((err) => {
      console.error('Unable to connect to the database:', err);
    });
}

module.exports = {
  connect,
  sequelize,
  Sequelize,
};
