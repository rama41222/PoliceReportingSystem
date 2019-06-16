const redis = require('redis');
const { redisConfig } = require('./../../../config');

const redisClient = redis.createClient(redisConfig.host);

redisClient.on('connect', function() {
  console.info('Redis client connected');
});

redisClient.on('error', function (err) {
  console.info('Something went wrong ' + err);
});

module.exports = redisClient;
