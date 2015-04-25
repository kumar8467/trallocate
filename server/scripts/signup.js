'use stict';
var Cache, Crypt, Emailer, Err, Events, UserInfo, getHtml, secret_salt, setUserInfoInCache;

Emailer = require('../helpers/emailer');
Crypt = require('../helpers/crypt');
Cache = require('../helpers/memory_cache');
UserInfo = require('../models/user_info');
Err = require('../helpers/error_handler');
secret_salt = 'trellocate_secret_mission';


getHtml = function(user_activation_hash) {
  var text;
  text = "To Activate your Account click on this link ";
  text += "http://localhost:3000/activation?token=" + user_activation_hash;
  return text;
};

setUserInfoInCache = function(user_activation_hash, user_info) {
  var encrypted_user_info;
  user_info = JSON.stringify(user_info);
  encrypted_user_info = Crypt.encrypt(user_info, secret_salt);
  return Cache.set(user_activation_hash, encrypted_user_info);
};

exports.init = function(req, res, next) {
  if (req.body.email) {
  	var user_activation_hash;
  	var user_info = req.body;
    var authFail = function(err){
      return new Promise(function(resolve, reject){
        return reject(err);
      });
    };
    var authFailResponse = function(err){
      console.log("ERROR :: Error in signup process")
      return next(err);
    };
    var authUserSuccess = function(result){
      return UserInfo.isEmailAvailable(user_info.email);
    }
    var authEmailSuccess = function(result){
      user_activation_hash = Crypt.getRandomHash();
      console.log('User key:  ' + user_activation_hash);
      if (!(user_info.username && user_info.password && user_info.email)) {
		    return next(Err.status(101));
		  }
      return setUserInfoInCache(user_activation_hash, user_info);
    }

    var userCacheSavedSuccess = function(){
    	console.log("Preparing to send email")
      var mailOptions;
      if (user_activation_hash) {
        mailOptions = {
          from: 'testing8467@gmail.com',
          to: user_info.email,
          subject: 'Trallocate Email Verification',
          text: 'Trallocate Email Verification',
          html: getHtml(user_activation_hash)
        };
        console.log("Sending Email now")
        Emailer.sendEmail(mailOptions);
	      sucess_obj = {
	        status: 'success',
	        message: null,
	        data: null
	      };
	      console.log("Sending response")
	      return res.end(JSON.stringify(sucess_obj));
      } else {
        return next(Err.status(108));
      }
    }

    UserInfo.isUsernameAvailable(user_info.username)
    .then(authUserSuccess,authFail)
    .then(authEmailSuccess,authFail)
    .then(userCacheSavedSuccess, authFailResponse)
  } else {
    obj = {
      response: false
    };
    return res.end(JSON.stringify(obj));
  }
};

exports.activate = function(req, res, next) {
  if (!(token = req.query.token)) {
    return next(Err.status(105));
  }
  var authFail = function(err){
    return new Promise(function(resolve, reject){
      return reject(err);
    });
  };
  var authFailResponse = function(err){
    console.log("ERROR :: Error in signup process")
    return  res.render('signup_error');
  };
  var decrypted_data;
  var cacheFetchedSuccess = function(result){
    console.log("cache data fetched");
    console.log(result);
    decrypted_data_string = Crypt.decrypt(result, secret_salt);
    if (decrypted_data_string) {
    	console.log("fetched user data from cache :: " + decrypted_data_string)
      decrypted_data = JSON.parse(decrypted_data_string);
    }
    return UserInfo.isUsernameAvailable(decrypted_data.username)
  };

  var authUserSuccess = function(result){
  	return UserInfo.isEmailAvailable(decrypted_data.email);
  };

  var authEmailSuccess = function(){
  	return UserInfo.create(decrypted_data);
  };

  var userCreatedSuccess = function(result){
    return res.render('signup_success');
  };
  
  Cache.get(token)
  .then(cacheFetchedSuccess,authFail)
  .then(authUserSuccess,authFail)
  .then(authEmailSuccess,authFail)
  .then(userCreatedSuccess, authFailResponse)
};

