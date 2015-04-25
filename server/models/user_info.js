var Err, Mongo, User, collection, getNewRecord, hidden_fields, map_data, model, required_fields, unique_fields, validate;

Mongo = require('../helpers/mongo');
User = require('../models/user');
Err = require('../helpers/error_handler');
collection = 'UsersInfo';
var Promise = require('promise');

model = function() {
  return {
    username: '',
    email: '',
    active: true,
    createdAt: Date.now().toString(),
    updatedAt: Date.now().toString(),
    location: 'Mumbai',
    admin: false
  };
};

required_fields = ['username', 'email', 'password'];

unique_fields = ['username', 'email'];

hidden_fields = {
  _id: 0
};

map_data = function(data) {
  var key, record;
  record = model();
  for (key in record) {
    if (data[key] !== null && data[key] !== undefined) {
      record[key] = data[key];
    } else {
      delete record[key];
    }
  }
  console.log(data);
  console.log(record);
  return record;
};

getNewRecord = function(data) {
  var key, record;
  record = model();
  for (key in record) {
    if (data[key]) {
      record[key] = data[key];
    }
  }
  return record;
};

validate = function(data) {
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

exports.isValidUsername = function(username) {
	return new Promise(function(resolve,reject){
		var success = function(result){
			console.log("SUCCESS :: Valid Username");
	  	if(result.length === 0){
	  		return reject();	
	  	}else{
	  		return resolve(result);	
	  	}
		};
		var failed = function(err){
			console.log("ERROR :: Invalid Username");
			return reject();	
		};
	  	return Mongo.find(collection, {username: username}, hidden_fields)
	  	.then(success,failed)
	});
};

exports.isValidEmail = function(email) {
	return new Promise(function(resolve,reject){
		var success = function(result){
  		if(result && result.length){
  			console.log("SUCCESS :: Valid Email")
	  		return resolve(result);
	  	}else{
	  		console.log("ERROR :: InValid Email - Already Taken")
	  		return reject(result);
	  	}
	  };
	  var failed = function(err){
	  	console.log("ERROR :: InValid Email")
	  	return reject(err);
	  };
	  return Mongo.find(collection, {email: email}, hidden_fields)
	  .then(success, failed);
	});
};


exports.isUsernameAvailable = function(username) {
	return new Promise(function(resolve,reject){
		var success = function(result){
			console.log("SUCCESS :: Valid Username");
	  	if(result.length === 0){
	  		console.log("SUCCESS: Username available")
	  		return resolve();	
	  	}else{
	  		console.log("ERROR: Username already taken");
	  		return reject();	
	  	}
		};
		var failed = function(err){
			console.log("ERROR :: Error while checking username availablily");
			return reject();	
		};
	  Mongo.find(collection, {username: username}, hidden_fields)
	  .then(success,failed)
	});
};

exports.isEmailAvailable = function(email) {
	return new Promise(function(resolve,reject){
		var success = function(result){
			if(result && result.length){
				console.log("ERROR: Email already taken")
				return reject();
			}else{
				console.log("SUCCESS :: Email available")
				return resolve();
			};
		};
	  var failed = function(err){
	  	console.log("ERROR :: Error while checking email availablily");
	  	return reject(err);
	  };
	  Mongo.find(collection, {email: email}, hidden_fields)
	  .then(success, failed);
	});
};

exports.create = function(data) {
	return new Promise(function(resolve,reject){
		var user_record = getNewRecord(data);
		console.log("CREATE:: Creating User record for data = " + JSON.stringify(data));
		var userInfoSuccess = function(result){
			if (!(result && result.ops && result.ops[0] && result.ops[0].id)) {
	     	console.log("ERROR:: Creating Userinfo record");
	      return reject(Err.status(111));
	    }
	    console.log("SUCCESS:: Creating Userinfo record created");
	    user_record.user_id = result.ops[0].id;
	    user_record.password = data.password;
	    return User.create(user_record);
	  };
	  var userSuccess = function(result){
	  	console.log("SUCCESS:: Creating User record created");
	  	if (user_record.password) {
	      delete user_record.password;
	    }
	    return resolve(user_record)
	  };
	  var failed = function(err){
	  	console.log("ERROR:: Creating Userinfo record");
	  	return reject(err)
	  };
	  var valid
	  if ((valid = validate(data)).error) {
	  	return failed(Err.status(110, 409, valid.message))
	  }
  	Mongo.create(collection, user_record)
  	.then(userInfoSuccess,failed)
  	.then(userSuccess,failed);
	})
};

exports.remove = function(query) {
	return new Promise(function(resolve,reject){
		var success = function(result){
	  	return resolve(result);
	  };
	  var failed = function(err){
	  	return reject(err);
	  };
		Mongo.update(collection, query, {$set: {active: false}}).then(success,failed);
	})
};

exports.find = function(query) {
	return new Promise(function(resolve,reject){
		if (query === null) {
	    query = {};
	  }
	  var success = function(result){
	  	return resolve(result);
	  };
	  var failed = function(err){
	  	return reject(err);
	  };
	  Mongo.find(collection, query, hidden_fields).then(success,failed);
	})
};

exports.get = function(query) {
	return new Promise(function(resolve,reject){
		var success = function(result){
			if (result && result.length) {
	      result = result[0];
	      return resolve(result);
	    }else{
	    	return reject(err)
	    }
	  };
	  var failed = function(err){
	  	return reject(err);
	  };
	  Mongo.find(collection, query, hidden_fields).then(success,failed);
	})
};

exports.update = function(query, updated_data) {
	return new Promise(function(resolve,reject){
		updated_data = map_data(updated_data);
		var success = function(result){
	  	return resolve(result);
	  };
	  var failed = function(err){
	  	return reject(err);
	  };
	  return Mongo.update(collection, query, {$set: updated_data}).then(success,failed);
	})
};
