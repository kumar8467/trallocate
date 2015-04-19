'use stict';
var Cache, Crypt, Emailer, Err, Events, UserInfo, getHtml, secret_salt, setUserInfoInCache;

Emailer = require('../helpers/emailer');
Crypt = require('../helpers/crypt');
Cache = require('../helpers/memory_cache');
UserInfo = require('../models/user_info');
Events = require("events");
Err = require('../helpers/error_handler');
secret_salt = 'trellocate_secret_mission';


getHtml = function(user_activation_hash) {
  var text;
  text = "To Activate your Account click on this link ";
  text += "http://localhost:3000/activation?token=" + user_activation_hash;
  return text;
};

setUserInfoInCache = function(user_activation_hash, user_info, sendEmail) {
  var encrypted_user_info;
  if (!(user_info.username && user_info.password && user_info.email)) {
    return sendEmail(Err.status(101));
  }
  user_info = JSON.stringify(user_info);
  encrypted_user_info = Crypt.encrypt(user_info, secret_salt);
  return Cache.set(user_activation_hash, encrypted_user_info, sendEmail);
};

exports.init = function(req, res, next) {
  var duplicateUsernameCheckCallback, emailid, obj, signupEvent, user_info;
  if (req.body.email) {
    emailid = req.body.email;
    signupEvent = new Events.EventEmitter();
    user_info = req.body;
    duplicateUsernameCheckCallback = function(err, result) {
      if (result && result.length) {
        return next(Err.status(102));
      }
      return signupEvent.emit("duplicateEmailCheck", user_info);
    };
    UserInfo.isValidUsername(user_info.username, duplicateUsernameCheckCallback);
    signupEvent.on('duplicateEmailCheck', function(user_info) {
      var duplicateEmailCheckCallback;
      duplicateEmailCheckCallback = function(err, result) {
        if (result) {
          return next(Err.status(103));
        }
        return signupEvent.emit("fireActivationEmail", user_info);
      };
      return UserInfo.isValidEmail(user_info.email, duplicateEmailCheckCallback);
    });
    return signupEvent.on('fireActivationEmail', function(user_info) {
      var sendEmail, sucess_obj, user_activation_hash;
      user_activation_hash = Crypt.getRandomHash();
      console.log('User key:  ' + user_activation_hash);
      sendEmail = function(error) {
        var mailOptions;
        if (error) {
          return next(Err.status(104));
        }
        if (user_activation_hash) {
          mailOptions = {
            from: 'testing8467@gmail.com',
            to: emailid,
            subject: 'Trallocate Email Verification',
            text: 'Trallocate Email Verification',
            html: getHtml(user_activation_hash)
          };
          return Emailer.sendEmail(mailOptions);
        } else {
          return next(Err.status(108));
        }
      };
      setUserInfoInCache(user_activation_hash, user_info, sendEmail);
      sucess_obj = {
        status: 'success',
        message: null,
        data: null
      };
      return res.end(JSON.stringify(sucess_obj));
    });
  } else {
    obj = {
      response: false
    };
    return res.end(JSON.stringify(obj));
  }
};

exports.activate = function(req, res, next) {
  var activationEvent, fetchCachedData, token;
  activationEvent = new Events.EventEmitter();
  if (!(token = req.query.token)) {
    return next(Err.status(105));
  }
  fetchCachedData = function() {
    var createRecord;
    createRecord = function(err, result) {
      console.log("cache data fetched");
      console.log(result);
      var decrypted_data, decrypted_data_string;
      if (err) {
        return next(Err.status(106));
      } else if (result) {
        decrypted_data_string = Crypt.decrypt(result, secret_salt);
        if (decrypted_data_string) {
          decrypted_data = JSON.parse(decrypted_data_string);
        }
        return activationEvent.emit("duplicateUsernameCheck", decrypted_data);
      } else {
        return next(Err.status(107));
      }
    };
    return Cache.get(token, createRecord);
  };
  activationEvent.on('duplicateUsernameCheck', function(decrypted_data) {
    var duplicateUsernameCheckCallback;
    duplicateUsernameCheckCallback = function(err, result) {
      console.log("Username check");
      console.log(result);
      if (result && result.length) {
        return next(Err.status(102));
      }
      return activationEvent.emit("duplicateEmailCheck", decrypted_data);
    };
    return UserInfo.isValidUsername(decrypted_data.username, duplicateUsernameCheckCallback);
  });
  activationEvent.on('duplicateEmailCheck', function(decrypted_data) {
    var duplicateEmailCheckCallback;
    duplicateEmailCheckCallback = function(err, result) {
      console.log("Email check");
      console.log(result);
      if (result) {
        return next(Err.status(103));
      }
      return activationEvent.emit("createUserAccount", decrypted_data);
    };
    return UserInfo.isValidEmail(decrypted_data.email, duplicateEmailCheckCallback);
  });
  activationEvent.on('createUserAccount', function(decrypted_data) {
    var mainResponse;
    mainResponse = function(err, result, user_info) {
      var sucess_obj;
      if (err) {
        return next(Err.status(109));
      }
      return res.render('signup_success');
    };
    return UserInfo.create(decrypted_data, mainResponse);
  });
  return fetchCachedData();
};

