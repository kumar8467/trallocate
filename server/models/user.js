var Mongo = require('../helpers/mongo');
var Crypt = require('../helpers/crypt');
var Err = require('../helpers/error_handler');
var Promise = require('promise');
var collection = 'Users';

var model = function() {
  return {
    user_id: null,
    password: '',
    createdAt: Date.now().toString(),
    updatedAt: Date.now().toString()
  };
};

var required_fields = ['user_id', 'password'];

var unique_fields = [];

var hidden_fields = {
  _id: 0
};

var getNewRecord = function(data) {
  var record;
  record = model();
  record.user_id = data.user_id;
  record.password = Crypt.encrypt(data.password, record.createdAt);
  return record;
};

var validate = function(data) {
  var i, len, required_field;
  if (!data) {
    return {
      error: true,
      message: 'UserInfo Validation :: data not present'
    };
  }
  for (i = 0, len = required_fields.length; i < len; i++) {
    required_field = required_fields[i];
    if (!data[required_field]) {
      return {
        error: true,
        message: 'UserInfo Validation :: ' + required_field + ' abscent'
      };
    }
  }
  return {
    error: false,
    message: null
  };
};

exports.create = function(data, callback) {
	console.log("Creating User where data = " + JSON.stringify(data));
	return new Promise(function(resolve, reject){
		var user_record, valid;
	  if ((valid = validate(data)).error) {
	  	console.log("ERROR :: Creating User where data = " + JSON.stringify(data));
	  	return reject()
	  }
	  user_record = getNewRecord(data);
	  return Mongo.create(collection, user_record, callback);
	});
};

exports.get = function(user_id, callback) {
	console.log("Fetching User for Id = " + user_id);
	return new Promise(function(resolve, reject){
	  if (user_id === null) {
	    query = {};
	  }else{
	    query = {user_id: user_id};
	  }
	  var fetchFail = function(err){
	  	reject(err)
	  }
	  var fetchSuccess = function(result){
	  	if(result && result.length === 0){
	  		console.log("ERROR :: Fetching User for query = " + JSON.stringify(query));
	  		return reject(err);
	  	}else{
	  		console.log("SUCCESS :: Fetching User for query = " + JSON.stringify(query));
	  		return resolve(result);
	  	}
	  }
	  return Mongo.find(collection, query, hidden_fields)
	  .then(fetchSuccess,fetchFail);
	})
};
