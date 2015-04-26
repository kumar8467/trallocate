var LoginDispatcher = require('../dispatchers/login-dispatcher');
var EventEmitter = require('events').EventEmitter;
var LoginConstants = require('../constants/login-constants');
var request = require('superagent');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';
var LOGOUT_EVENT = 'logout';
var authenticateUser, LoginStore;
var model = {
  authenticated     : false,
  authAwaited       : false,
  authStatus        : false, // check for request sucess or failed
  authRequestCount  : 0,
  loginAwaited      : false,
  loginStatus       : false, // check for request sucess or failed
  loginRequestCount : 0,
  user_data         : {},
};

var login_request = function(data){
  model.loginAwaited = true;
  model.loginRequestCount += 1;
  request
  .post('http://localhost:3000/api/v1/signin')
  .send(data)
  .set('Accept', 'application/json')
  .end(function(err, res){
    if(res.status == 200){
      try{
        model.authenticated = true;
        model.loginStatus = true;
        model.user_data = JSON.parse(res.text);
      }catch(e){
        console.log("ERROR: parsing data")
      }
    }else{
      model.authenticated = false;
      model.loginStatus = false;
    }
    model.loginAwaited = false;
    LoginStore.emitChange();
  });
  LoginStore.emitChange();
};

var authenticate_request = function(data){
  model.authAwaited = true;
  model.authRequestCount += 1;
  request
  .get('http://localhost:3000/api/v1/user-data')
  .set('Accept', 'application/json')
  .end(function(err, res){
    if(res.status == 200){
      try{
        var response =  JSON.parse(res.text);
        model.authenticated = response.session
        model.authStatus = true;
        model.user_data = response.user_data
      }catch(e){
        console.log("ERROR: parsing data")
      }
    }else{
      model.authStatus = false;
      model.authenticated = false;
    }
    model.authAwaited = false;
    LoginStore.emitChange();
  });
};

var logout_request = function(){
  document.cookie = 'cookieName=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  var model = {
    authenticated     : false,
    authAwaited       : false,
    authStatus        : false, // check for request sucess or failed
    authRequestCount  : 0,
    loginAwaited      : false,
    loginStatus       : false, // check for request sucess or failed
    loginRequestCount : 0,
    user_data         : {},
  };
}

LoginStore = assign({}, EventEmitter.prototype, {
  isAuthenticated: function(){
    return model.authenticated;
  },

  loginStatus: function(){
    return model.loginStatus;
  },

  loginInProcess: function(){
    return model.loginAwaited;
  },

  totalLoginReqMade: function(){
    return model.loginRequestCount;
  },

  authStatus: function(){
    return model.authStatus;
  },

  authInProcess: function(){
    return model.authAwaited;
  },

  totalAuthReqMade: function(){
    return model.authRequestCount;
  },

  setAuthentication: function(bool){
    return model.authenticated = bool
  },

  getUserInfo: function(){
    return model.user_data
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  emitLogoutChange: function() {
    this.emit(LOGOUT_EVENT);
  },

  addLogoutListener: function(callback) {
    this.on(LOGOUT_EVENT, callback);
  },

  removeLogoutListener: function(callback) {
    this.removeListener(LOGOUT_EVENT, callback);
  }
});


LoginDispatcher.register(function(action) {
  var text;

  switch(action.actionType) {
    case LoginConstants.LOGIN:
      login_request(action.data);
      LoginStore.emitChange();
      break;

    case LoginConstants.AUTHENTICATE:
      authenticate_request();
      LoginStore.emitChange();
      break;

    case LoginConstants.LOGOUT:
      logout_request()
      LoginStore.emitLogoutChange();
      break;

    default:
      // no op
  }
});

module.exports = LoginStore;