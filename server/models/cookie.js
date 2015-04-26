var Mongo = require('../helpers/mongo');
var Crypt = require('../helpers/crypt');
var Err = require('../helpers/error_handler');
var collection = 'Cookies';
var Promise = require('promise');

var model = function() {
  return {
    cookieName: '',
    createdAt : Date.now().toString()
  };
};

required_fields = ['cookieName'];

unique_fields = [];

hidden_fields = {
  _id: 0
};

var find = function(query) {
  return new Promise(function(resolve,reject){
    if (query === null) {
      query = {};
    }
    var success = function(result){
      return resolve(result)
    };
    var failed = function(err){
      return reject(err);
    }
    return Mongo.find(collection, query, hidden_fields)
    .then(success,failed);
  });
};

var create = function(data) {
  return new Promise(function(resolve,reject){
    var success = function(result){
      return resolve(result);
    };
    var failed = function(err){
      return reject(err);
    };
    return Mongo.create(collection, data)
    .then(success, failed);
  });
};

exports.set = function(user_data){
  return new Promise(function(resolve,reject){
    if(!user_data){
      console.log("ERROR :: No data provided while setting cookie")
      return reject();
    }
    var record = model();
    user_data = JSON.stringify(user_data);
    console.log("Create:: Creating cookie for user data = " + user_data)
    record.cookieName = Crypt.encrypt(user_data, record.createdAt);
    var success = function(result){
      return resolve(record.cookieName)
    };

    var failed = function(error){
      return reject(error)
    };
    create(record).
    then(success,failed);
  })
};

exports.get = function(cookie){
  console.log("Extracting user data from cookie :: " + cookie)
  return new Promise(function(resolve,reject){
    var success = function(result){
      if(result && result.length){
        try{
          var key = result[0].createdAt;
          var userData = Crypt.decrypt(cookie, key);
          console.log("User extracted :: " + userData);
          userData = JSON.parse(userData);
          return resolve(userData);
        }catch(err){
          return reject(err)
        }
      }else{
        console.log("Cookie Expired")
        return reject()
      }
    };

    var failed = function(error){
      return reject(error)
    };
    find({cookieName : cookie})
    .then(success,failed)
  })
};

exports.remove = function(query) {
	return new Promise(function(resolve,reject){
		var success = function(result){
			return resolve(result);
		};
		var failed = function(err){
			return reject(err);
		}
		return Mongo.update(collection, query, {$set: {active: false}})
		.then(success, fail)
	});
};