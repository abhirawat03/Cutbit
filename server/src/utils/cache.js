const cache = new Map();

export const getCache = (key) => {
  const data = cache.get(key);
  if (!data) return null;

  if (Date.now() > data.expiry) {
    cache.delete(key);
    return null;
  }

  return data.value;
};

export const setCache = (key, value, ttl = 60000) => {
  cache.set(key, {
    value,
    expiry: Date.now() + ttl,
  });
};

export const deleteCache = (key) => {
  cache.delete(key);
};

// optional (useful later)
export const clearCacheByPrefix = (prefix) => {
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) {
      cache.delete(key);
    }
  }
};