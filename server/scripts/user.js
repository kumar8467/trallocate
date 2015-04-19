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
  getCallback = function(err, result) {
    if (err) {
      return next(err);
    }
    return res.send(JSON.stringify({user: result}));
  };
  return UserInfo.get({
    id: parseInt(id,10)
  }, getCallback);
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
    findCallback = function(final_err, final_result) {
      if (final_err) {
        return next(final_err);
      }
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({users: final_result}));
    };
    return UserInfo.find(result, findCallback);
  };
  query = parseQuery(req.query, queryCallback);
  return;
};

exports.put = function(req, res, next) {
  var id, updateCallback;
  if (!(req.body && req.body.user && (id = req.params.id) && /^[1-9][0-9]*$/.test(id))) {
    return next(Err.status(100, 404, "Incorrect data Data"));
  }
  updateCallback = function(err, result) {
    if (err) {
      return next(err);
    }
    return res.send(JSON.stringify(result));
  };
  return UserInfo.update({
    id: parseInt(id,10)
  }, req.body.user, updateCallback);
};

exports["delete"] = function(req, res, next) {
  var id, updateCallback;
  if (!(req.body && (id = req.params.id) && /^[1-9][0-9]*$/.test(id))) {
    return next(Err.status(100, 404, "Incorrect data Data"));
  }
  updateCallback = function(err, result) {
    if (err) {
      return next(err);
    }
    return res.send(JSON.stringify(result));
  };
  return UserInfo.update({
    id: parseInt(id,10)
  }, req.body, updateCallback);
};
