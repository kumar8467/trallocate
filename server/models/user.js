var Mongo = require('../helpers/mongo');
var Crypt = require('../helpers/crypt');
var Err = require('../helpers/error_handler');
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
  var user_record, valid;
  if ((valid = validate(data)).error) {
    return callback(Err.status(110, 409, valid.message));
  }
  user_record = getNewRecord(data);
  return Mongo.create(collection, user_record, callback);
};

exports.get = function(user_id, callback) {
  var getUserCallback;
  if (user_id === null) {
    query = {};
  }else{
    query = {user_id: user_id};
  }
  getUserCallback = function(err, result) {
    return callback(err, result);
  };
  return Mongo.find(collection, query, hidden_fields, getUserCallback);
};
