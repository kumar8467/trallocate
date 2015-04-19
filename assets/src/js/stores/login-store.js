var LoginDispatcher = require('../dispatchers/login-dispatcher');
var EventEmitter = require('events').EventEmitter;
var LoginConstants = require('../constants/login-constants');
var request = require('superagent');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';
var authenticateUser, LoginStore;
var _user = {
  authenticated: false,
  user_data: {}
};

authenticateUser = function(data){
  request
  .post('http://localhost:3000/api/v1/authenticate')
  .send(data)
  .set('Accept', 'application/json')
  .end(function(err, res){
    if(res.status == 200){
      _user.authenticated = true;
      _user.user_data = JSON.parse(res.text);
    }
    LoginStore.emitChange();
  });
};

LoginStore = assign({}, EventEmitter.prototype, {
  isAuthenticated: function(){
    return _user.authenticated;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

LoginDispatcher.register(function(action) {
  var text;

  switch(action.actionType) {
    case LoginConstants.LOGIN:
      authenticateUser(action.data);
      break;

    case LoginConstants.LOGIN_SUCCESS:
      LoginStore.emitChange();
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
      // update(action.id, {complete: false});
      LoginStore.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = LoginStore;