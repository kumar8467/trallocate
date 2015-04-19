var Mongo = require('../helpers/mongo');
var Crypt = require('../helpers/crypt');
var Err = require('../helpers/error_handler');
var collection = 'Cookies';

var model = function() {
  return {
    cookieName: ''
  };
};

required_fields = ['cookieName'];

unique_fields = [];

hidden_fields = {
  _id: 0
};

var validate = function(data) {
  var i, len, required_field;
  if (!data) {
    return {
      error: true,
      message: 'Cookie Validation :: data not present'
    };
  }
  for (i = 0, len = required_fields.length; i < len; i++) {
    required_field = required_fields[i];
    if (!data[required_field]) {
      return {
        error: true,
        message: 'Cookie Validation :: ' + required_field + ' abscent'
      };
    }
  }
  return {
    error: false,
    message: null
  };
};


var getNewRecord = function(data) {
  var record;
  record = model();
  record.cookieName = data.cookieName;
  return record;
};

exports.create = function(data, callback) {
  var user_record, valid;
  if ((valid = validate(data)).error) {
    return callback(Err.status(110, 409, valid.message));
  }
  user_record = getNewRecord(data);
  return Mongo.create(collection, user_record, callback);
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