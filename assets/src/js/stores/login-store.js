var LoginDispatcher = require('../dispatchers/login-dispatcher');
var EventEmitter = require('events').EventEmitter;
var LoginConstants = require('../constants/login-constants');
var request = require('superagent');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';
var LOGOUT_EVENT = 'logout';
var authenticateUser, LoginStore;
var _admin_user = {
  authenticated: false,
  user_data: {},
  authentication_awaited: true
};

var login_user = function(data){
  _admin_user.authentication_awaited = false;
  request
  .post('http://localhost:3000/api/v1/signin')
  .send(data)
  .set('Accept', 'application/json')
  .end(function(err, res){
    if(res.status == 200){
      _admin_user.authenticated = true;
      _admin_user.user_data = JSON.parse(res.text);
      _admin_user.authentication_awaited = false;
    }
    LoginStore.emitChange();
  });
};

var user_data = function(data){
  request
  .get('http://localhost:3000/api/v1/user-data')
  .set('Accept', 'application/json')
  .end(function(err, res){
    if(res.status == 200){
      var response =  JSON.parse(res.text);
      _admin_user.authenticated = response.session
      _admin_user.authentication_awaited = false;
    }else{
      _admin_user.authentication_awaited = false;
      _admin_user.authenticated = false;
    }
    LoginStore.emitChange();
  });
};

var logout = function(){
  document.cookie = 'cookieName=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  _admin_user.authenticated = false
  _admin_user.user_data = {}
  _admin_user.authentication_awaited = true
}

LoginStore = assign({}, EventEmitter.prototype, {
  isAuthenticated: function(){
    return _admin_user.authenticated;
  },
  authInProcess: function(){
    return _admin_user.authentication_awaited;
  },
  setAuthentication: function(bool){
    _admin_user.authenticated = bool
  },
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },
  emitLogoutChange: function() {
    this.emit(LOGOUT_EVENT);
  },
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  addLogoutListener: function(callback) {
    this.on(LOGOUT_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  removeLogoutListener: function(callback) {
    this.removeListener(LOGOUT_EVENT, callback);
  }
});

LoginDispatcher.register(function(action) {
  var text;

  switch(action.actionType) {
    case LoginConstants.LOGIN:
      login_user(action.data);
      break;

    case LoginConstants.AUTHENTICATE:
      user_data();
      break;

    case LoginConstants.LOGIN_FAIL:
      // update(action.id, {complete: false});
      LoginStore.emitChange();
      break;

    case LoginConstants.LOGIN_AFTER:
      // update(action.id, {complete: false});
      LoginStore.emitChange();
      break;

    case LoginConstants.LOGOUT:
      logout()
      LoginStore.emitLogoutChange();
      break;

    default:
      // no op
  }
});

module.exports = LoginStore;