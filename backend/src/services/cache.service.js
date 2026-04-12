const { getRedisClient, isRedisReady } = require('../config/redis');

const get = async (key) => {
  if (!isRedisReady()) return null;

  const client = getRedisClient();
  const value = await client.get(key);
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const set = async (key, value, ttlSeconds) => {
  if (!isRedisReady()) return;

  const client = getRedisClient();
  const payload = typeof value === 'string' ? value : JSON.stringify(value);

  if (ttlSeconds) {
    await client.set(key, payload, { EX: ttlSeconds });
    return;
  }

  await client.set(key, payload);
};

const del = async (key) => {
  if (!isRedisReady()) return;
  await getRedisClient().del(key);
};

const delByPattern = async (pattern) => {
  if (!isRedisReady()) return;

  const client = getRedisClient();
  const keys = [];

  for await (const key of client.scanIterator({ MATCH: pattern, COUNT: 100 })) {
    keys.push(key);
  }

  if (keys.length) {
    await client.del(keys);
  }
};

module.exports = {
  get,
  set,
  del,
  delByPattern,
};
