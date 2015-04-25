var Err, QueryString, UserInfo, parseQuery;

UserInfo = require('../models/user_info');
Err = require('../helpers/error_handler');
QueryString = require('querystring');

parseQuery = function(query, queryCallback) {
  var i, id, ids, key, len, ref;
  if (query.id) {
    ids = [];
    ref = query.id.split(',');
    for (i = 0, len = ref.length; i < len; i++) {
      id = ref[i];
      if (/[0-9]*/.test(id)) {
        id = parseInt(id,10);
        if (isNaN(id)) {
          return queryCallback(Err.status(100, 404, 'Wrong Query'));
        } else {
          ids.push(id);
        }
      } else {
        return queryCallback(Err.status(100, 404, 'Wrong Query'));
      }
    }
    query.id = {
      $in: ids
    };
  }
  for (key in query) {
    if (query[key] === 'true') {
      query[key] = true;
    }
    if (query[key] === 'false') {
      query[key] = false;
    }
  }
  query = {$and: [query , {id: {$gte: 1}}]};
  return queryCallback(null, query);
};


/*
	provide id in user/:id this will return the user info
 */

exports.get = function(req, res, next) {
  var getCallback, id;
  if (!(req.params && (id = req.params.id) && /^[1-9][0-9]*$/.test(id))) {
    return next(Err.status(100, 404, "User not found"));
  }
  var success = function(result){
  	return res.send(JSON.stringify({user: result}));
  };
  var failed = function(err){
  	return next(err);
  };
  return UserInfo.get({id: parseInt(id,10)})
  .then(success, failed);
};


/*
	For ids write /users/id=1,2,3,4&active=true
	give comma separated ids
	and active true or false
 */

exports.find = function(req, res, next) {
  var query, queryCallback;
  if (!req.query) {
    return next(Err.status(100, 404, "User not found"));
  }
  queryCallback = function(err, result) {
    var findCallback;
    if (err) {
      return next(err);
    }
    var success = function(final_result){
  		res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({users: final_result}));
	  };
	  var failed = function(err){
	  	return next(err);
	  };
    return UserInfo.find(result).then(success, failed);;
  };
  query = parseQuery(req.query, queryCallback);
};

exports.put = function(req, res, next) {
  var id, updateCallback;
  if (!(req.body && req.body.user && (id = req.params.id) && /^[1-9][0-9]*$/.test(id))) {
    return next(Err.status(100, 404, "Incorrect data Data"));
  }
  var success = function(result){
		return res.send(JSON.stringify(result));
  };
  var failed = function(err){
  	return next(err);
  };
  return UserInfo.update({id: parseInt(id,10)}, req.body.user).then(success, failed);
};

exports["delete"] = function(req, res, next) {
  var id, updateCallback;
  if (!(req.body && (id = req.params.id) && /^[1-9][0-9]*$/.test(id))) {
    return next(Err.status(100, 404, "Incorrect data Data"));
  };
  var success = function(result){
		return res.send(JSON.stringify(result));
  };
  var failed = function(err){
  	return next(err);
  };
  return UserInfo.update({id: parseInt(id,10)}, req.body).then(success, failed);
};
