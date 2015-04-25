var cacheManager, memoryCache;

cacheManager = require('cache-manager');
var Promise = require('promise');

memoryCache = cacheManager.caching({
  store: 'memory',
  max: 1000,
  ttl: 1000
});

exports.get = function(key) {
	return new Promise(function(resolve,reject){
		memoryCache.get(key, function(err, result){
			if(err || !result){
				console.log("ERROR: Activation key is not fetched")
				return reject(err)
			}else{
				console.log("SUCCESS: Activation key fetched from cache")
				return resolve(result)
			}
		});
	})
};

exports.set = function(key, value) {
	return new Promise(function(resolve,reject){
		memoryCache.set(key, value, 1000, function(err, result){
			if(err){
				console.log("ERROR: Activation key is not saved")
				return reject(err)
			}else{
				console.log("SUCCESS: Activation key saved in cache")
				return resolve(result)
			}
		});
	})
};

exports["delete"] = function(key, callback) {
	return new Promise(function(resolve,reject){
		memoryCache.get(key,function(err, result){
			if(err){
				return reject(err)
			}else{
				return resolve(result)
			}
		});
	})
};
