var Err, Mongo, User, collection, getNewRecord, hidden_fields, map_data, model, required_fields, unique_fields, validate;

Mongo = require('../helpers/mongo');
User = require('../models/user');
Err = require('../helpers/error_handler');
collection = 'UsersInfo';

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

exports.isValidUsername = function(username, callback) {
  var onValidation;
  onValidation = function(err, result) {
    return callback(err, result);
  };
  return Mongo.find(collection, {
    username: username
  }, hidden_fields, onValidation);
};

exports.isValidEmail = function(email, callback) {
  var onValidation;
  onValidation = function(err, result) {
    return callback(err, result.length);
  };
  return Mongo.find(collection, {
    email: email
  }, hidden_fields, onValidation);
};

exports.create = function(data, callback) {
  var userCreatedCallback, user_record, valid;
  if ((valid = validate(data)).error) {
    return callback(Err.status(110, 409, valid.message));
  }
  user_record = getNewRecord(data);
  userCreatedCallback = function(err, result) {
    var sendUserInfo;
    if (err && !(result && result.ops && result.ops[0] && result.ops[0].id)) {
      return callback(Err.status(111));
    }
    user_record.user_id = result.ops[0].id;
    user_record.password = data.password;
    sendUserInfo = function(err, result) {
      if (err) {
        return callback(err, result);
      }
      if (user_record.password) {
        delete user_record.password;
      }
      return callback(err, result, user_record);
    };
    return User.create(user_record, sendUserInfo);
  };
  return Mongo.create(collection, user_record, userCreatedCallback);
};

exports.remove = function(query, callback) {
  return Mongo.update(collection, query, {
    $set: {
      active: false
    }
  }, callback);
};

exports.find = function(query, callback) {
  if (query === null) {
    query = {};
  }
  return Mongo.find(collection, query, hidden_fields, callback);
};

exports.get = function(query, callback) {
  var getUserCallback;
  getUserCallback = function(err, result) {
    if (err) {
      return callback(err, result);
    }
    if (result.length >= 1) {
      result = result[0];
    }
    return callback(err, result);
  };
  return Mongo.find(collection, query, hidden_fields, getUserCallback);
};

exports.update = function(query, updated_data, callback) {
  updated_data = map_data(updated_data);
  return Mongo.update(collection, query, {
    $set: updated_data
  }, callback);
};
