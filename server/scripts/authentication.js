'use stict';
var Cache, Crypt, Emailer, Err, Events, UserInfo, User, secret_salt, setUserInfoInCache;

Crypt = require('../helpers/crypt');
UserInfo = require('../models/user_info');
User = require('../models/user');
Cookie = require('../models/cookie');
Events = require("events");
Err = require('../helpers/error_handler');
secret_salt = 'trellocate_secret_mission';

/*
Compare user name and password
if not ok then return 403 incorrect user name and password
if ok 
take username add a salt timestamp and encode it 
save the cookie in mongodb with cookiename and set ttl to expiry time
create a object with name path domain expiry time
*/

exports.user_data = function(req, res, next){
  var responsed = {}
  if(req.authenticated){
    var response = {session: true};
  }else{
    response = {session: false};
  }
  res.end(JSON.stringify(response))
}
exports.init = function(req, res, next) {
  console.log(req.body);
  if(req.body.username && req.body.password){
    authenticationEvent = new Events.EventEmitter();
    var authenticateUsernameCheckCallback;
    
    authenticateUsernameCheckCallback = function(err, result) {
      if (err || result.length === 0) {
        return next(Err.status(403));
      }
      return authenticationEvent.emit("authenticatePassword", result[0]);
    };

    authenticationEvent.on('authenticatePassword', function(userdata) {
      var authenticatePasswordCheckCallback;
      authenticatePasswordCheckCallback = function(err, result) {
        console.log(result);
        if (err || result.length === 0) {
          return next(Err.status(403));
        }
        var decrypt_password = Crypt.decrypt(result[0].password, result[0].createdAt);
        console.log(decrypt_password);
        if(decrypt_password == req.body.password){
          return authenticationEvent.emit("saveCookie", userdata);
        }else{
          return next(Err.status(403));
        }
      };
      User.get(userdata.id, authenticatePasswordCheckCallback);
    });

    authenticationEvent.on('saveCookie', function(userdata){
      var cookie = Crypt.encrypt(Date.now().toString(), '');
      var setCookieCallback = function(err, result){
        if(err){
          console.log(err);
          return next(Err.status(403));
        }
        res.cookie('cookieName',cookie , { maxAge: 900000, httpOnly: false});
        return res.end(JSON.stringify(userdata));
      };
      Cookie.create({cookieName: cookie},setCookieCallback);
    });
    return UserInfo.isValidUsername(req.body.username, authenticateUsernameCheckCallback);
  }
};