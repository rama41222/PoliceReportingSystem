const {
  APP,
  NODE_ENV,
  PORT = 3000,
  SQL_HOST = 'localhost',
  SQL_PORT,
  SQL_DIALECT,
  SQL_USER = 'sa',
  SQL_PASSWORD = 'test@123',
  SQL_DB = 'stolen',
  SQL_OPERATORS_ALIASES,
  SQL_POOL_MAX,
  SQL_POOL_MIN,
  SQL_POOL_ACQ,
  SQL_POOL_IDLE,
  SQL_LOGGING,
  REDIS_URL,
} = process.env;

const config = {
  app: {
    name: APP,
    debug: true,
    isProduction: NODE_ENV !== 'production',
    port: PORT,
  },
  corsConfig: {
    enabled: true,
    credentials: true,
  },
  redisConfig: {
    url: REDIS_URL,
  },
  database: {
    host: SQL_HOST,
    dialect: SQL_DIALECT,
    port: SQL_PORT,
    name: SQL_DB,
    username: SQL_USER,
    password: SQL_PASSWORD,
    operatorsAliases: SQL_OPERATORS_ALIASES,
    logging: parseInt(SQL_LOGGING, 10),
    pool: {
      max: parseInt(SQL_POOL_MAX, 10),
      min: parseInt(SQL_POOL_MIN, 10),
      acquire: SQL_POOL_ACQ,
      idle: SQL_POOL_IDLE,
    },
  },
};

module.exports = config;
