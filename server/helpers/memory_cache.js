var cacheManager, memoryCache;

cacheManager = require('cache-manager');

memoryCache = cacheManager.caching({
  store: 'memory',
  max: 1000,
  ttl: 1000
});

exports.get = function(key, callback) {
  return memoryCache.get(key, callback);
};

exports.set = function(key, value, callback) {
  return memoryCache.set(key, value, 1000, callback);
};

exports["delete"] = function(key, callback) {
  return memoryCache.del(key, callback);
};
