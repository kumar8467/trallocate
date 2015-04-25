var Err, MongoClient, db, getCollection;

MongoClient = require('mongodb').MongoClient;

Err = require('./error_handler');

db = null;

exports.connect = function() {
  return MongoClient.connect("mongodb://localhost:27017/trallocate_development", function(err, database) {
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

exports.create = function(collection_name, record) {
	console.log("CREATE :: Creating records for " + collection_name + "where data = " + JSON.stringify(record))
	return new Promise(function(resolve, reject){
		var collection, getSequenceCallback;
	  if (!db) {
	  	console.log("ERROR: Database not found")
	  	return reject();
	  }
	  collection = getCollection(db, collection_name);
	  if (!collection) {
	  	console.log("ERROR: Collection not found")
	  	return reject();
	  }
	  getSequenceCallback = function(err, result) {
	    if (err) {
	    	console.log("ERROR: while Creating record")
	      return reject(err);
	    }
	    record.id = result.value.sequence_value;
	    return collection.insert(record, function(err, result) {
	      if(err){
	      	console.log("ERROR: while Creating record");
	      	return reject(err);
	      }else{
	      	console.log("SUCCESS: Record Created");
	      	return resolve(result);
	      }
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
	})
};

exports.remove = function(collection_name, query) {
	return new Promise(function(reject, resolve){
		 var collection;
	  if (!db) {
	  	console.log("ERROR: Database not found")
	  	return reject();
	  }
	  if (!query) {
	    console.log("ERROR: Query not found")
	  	return reject();
	  }
	  console.log("DELETE :: Removing records for " + collection_name + "where query = " + JSON.stringify(query))
	  collection = getCollection(db, collection_name);
	  if (!collection) {
	    console.log("ERROR: Collection not found")
	  	return reject();
	  }
	  return collection.insert(query, function(err, result) {
	    if(err){
	  		console.log("ERROR: while finding record")
	  		return reject(err);
	  	}else{
	  		console.log("SUCCESS: Record found = " + JSON.stringify(result));
	  		return resolve(result);
	  	}
  	});
	});
};


exports.find = function(collection_name, query, hidden_fields) {
	console.log("QUERY :: Finding records for " + collection_name + "where query = " + JSON.stringify(query));
	return new Promise(function(resolve, reject){
		var collection;
	  if (query == null) {
	    query = {};
	  }
	  if (!db) {
	  	console.log("ERROR: Database not found")
	  	return reject();
	  }
	  collection = getCollection(db, collection_name);
	  if (!collection) {
	  	console.log("ERROR: Collection not found")
	  	return reject();
	  }
	  return collection.find(query, hidden_fields).toArray(function(err, result) {
	  	if(err){
	  		console.log("ERROR: while finding record")
	  		return reject(err);
	  	}else{
	  		console.log("SUCCESS: Record found = " + JSON.stringify(result));
	  		return resolve(result);
	  	}
	  });
	})
};

exports.update = function(collection_name, query, updated_object) {
	return new Promise(function(resolve, reject){
		var collection;
	  if (!db) {
	  	console.log("ERROR: Database not found")
	  	return reject();
	  }
	  if (!query) {
	    console.log("ERROR: Query not found")
	  	return reject();
	  }
	  console.log("QUERY :: Updating records for " + collection_name + "where query = " + JSON.stringify(query));
	  collection = getCollection(db, collection_name);
	  if (!collection) {
	  	console.log("ERROR: Collection not found")
	  	return reject();
	  }
	  return collection.update(query, updated_object, function(err, result) {
	    if(err){
	  		console.log("ERROR: while finding record")
	  		return reject(err);
	  	}else{
	  		console.log("SUCCESS: Record found = " + JSON.stringify(result));
	  		return resolve(result);
	  	}
	  });
	});
};
