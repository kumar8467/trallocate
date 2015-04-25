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
  var userdata = {};
  var cookie = Crypt.encrypt(Date.now().toString(), '');
  if(req.body.username && req.body.password){
    var authFail = function(err){
      return new Promise(function(resolve, reject){
        return reject(err);
      });
    }
    var authUserSuccess = function(result){
      console.log("SUCCESS :: Username Authenticated")
      userdata = result[0];
      return User.get(userdata.id);
    }
    var authPasswordSuccess = function(result){
      var decrypt_password = Crypt.decrypt(result[0].password, result[0].createdAt);
      if(decrypt_password == req.body.password){
        console.log("SUCCESS :: Password Matched")
        return Cookie.create({cookieName: cookie});
      }else{
        console.log("ERROR :: Password Mismatching")
        return authFail(Err.status(403));
      }
    }
    var setCookieSuccess = function(result){
      console.log("SUCCESS :: Cookie saved to database")
      res.cookie('cookieName',cookie , { maxAge: 900000, httpOnly: false});
      return res.end(JSON.stringify(userdata));
    };
    var authFailResponse = function(err){
      console.log("ERROR :: Error in signup process")
      return next(err);
    };

    UserInfo.isValidUsername(req.body.username)
    .then(authUserSuccess,authFail)
    .then(authPasswordSuccess,authFail)
    .then(setCookieSuccess,authFailResponse)

  }else{
    console.log("ERROR:: Username or Password Missing");
    return next(Err.status(403));
  }
};