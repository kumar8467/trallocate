var Err, MongoClient, db, getCollection;

MongoClient = require('mongodb').MongoClient;

Err = require('./error_handler');

db = null;

exports.connect = function() {
  return MongoClient.connect("mongodb://localhost:27017/trallocate_dev", function(err, database) {
    if (err) {
      console.log("ERROR:: Not able to connect to mongodb");
      throw err;
    } else {
      db = database;
      return console.log("SUCCESS:: We are connected");
    }
  });
};

getCollection = function(db, collection_name) {
  var collection;
  if (!collection_name) {
    console.log('Collection Name missing in the Model');
    return;
  }
  collection = db.collection(collection_name);
  if (!collection) {
    return;
  }
  return collection;
};

exports.create = function(collection_name, record, callback) {
  var collection, getSequenceCallback;
  if (!db) {
    return callback(Err.status(112));
  }
  collection = getCollection(db, collection_name);
  if (!collection) {
    return callback(Err.status(113));
  }
  getSequenceCallback = function(err, result) {
    if (err) {
      return callback(err, result);
    }
    record.id = result.value.sequence_value;
    return collection.insert(record, function(err, result) {
      return callback(err, result);
    });
  };
  return collection.findAndModify({
    id: collection_name
  }, [['id', 1]], {
    $inc: {
      sequence_value: 1
    }
  }, {
    "new": true
  }, getSequenceCallback);
};

exports.remove = function(collection_name, query, callback) {
  var collection;
  if (!db) {
    return callback(Err.status(112));
  }
  if (!query) {
    return calback(Err.status(114));
  }
  collection = getCollection(db, collection_name);
  if (!collection) {
    return callback(Err.status(113));
  }
  return collection.insert(query, function(err, result) {
    return callback(err, result);
  });
};

exports.find = function(collection_name, query, hidden_fields, callback) {
  var collection;
  if (query == null) {
    query = {};
  }
  if (!db) {
    return callback(Err.status(112));
  }
  collection = getCollection(db, collection_name);
  if (!collection) {
    return callback(Err.status(113));
  }
  return collection.find(query, hidden_fields).toArray(function(err, result) {
    return callback(err, result);
  });
};

exports.update = function(collection_name, query, updated_object, callback) {
  var collection;
  if (!db) {
    return callback(Err.status(112));
  }
  if (!query) {
    return calback(Err.status(115));
  }
  collection = getCollection(db, collection_name);
  if (!collection) {
    return callback(Err.status(113));
  }
  return collection.update(query, updated_object, function(err, result) {
    return callback(err, result);
  });
};
