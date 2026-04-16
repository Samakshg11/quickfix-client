const { createClient } = require('redis');
const logger = require('./logger');

let redisClient = null;
let isReady = false;

const getRedisUrl = () => process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const shouldRetryConnection = () => process.env.REDIS_RETRY === 'true';

const connectRedis = async () => {
  if (redisClient) return redisClient;

  redisClient = createClient({
    url: getRedisUrl(),
    socket: {
      reconnectStrategy: (retries) => {
        if (!shouldRetryConnection()) return false;
        return Math.min(retries * 200, 3000);
      },
    },
  });

  redisClient.on('error', (error) => {
    isReady = false;
    logger.warn(`Redis error: ${error.message}`);
  });

  redisClient.on('ready', () => {
    isReady = true;
    logger.info('✅ Redis connected');
  });

  redisClient.on('end', () => {
    isReady = false;
    logger.warn('Redis connection closed');
  });

  try {
    await redisClient.connect();
  } catch (error) {
    isReady = false;
    logger.warn(`Redis unavailable, continuing without cache: ${error.message}`);
  }

  return redisClient;
};

const getRedisClient = () => redisClient;
const isRedisReady = () => !!redisClient && isReady;

module.exports = {
  connectRedis,
  getRedisClient,
  isRedisReady,
};
