const { connectSQL, sequelize, Sequelize } = require('./sequelize');
const { redisClient, connectRedis } = require('./redis');

module.exports = {
  connectSQL,
  connectRedis,
  sequelize,
  Sequelize,
  redisClient
};
