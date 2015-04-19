var SignupDispatcher = require('../dispatchers/signup-dispatcher');
var EventEmitter = require('events').EventEmitter;
var SignupConstants = require('../constants/signup-constants');
var request = require('superagent');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';
var authenticateUser, LoginStore;
var _signup = {
  authentication_awaited: false,
  signup_error: false,
};

createUser = function(data){
  request
  .post('http://localhost:3000/api/v1/signup')
  .send(data)
  .set('Accept', 'application/json')
  .end(function(err, res){
    if(err){
      _signup.signup_error = true;
      _signup.authentication_awaited = true;
    }else{
      _signup.authentication_awaited = true;
      _signup.signup_error = false;
    }
    SignupStore.emitChange();
  });
};

SignupStore = assign({}, EventEmitter.prototype, {
  emailSent: function(){
    return _signup.authentication_awaited;
  },
  signupError: function(){
    return _signup.signup_error;
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

SignupDispatcher.register(function(action) {
  var text;

  switch(action.actionType) {
    case SignupConstants.SIGNUP:
      createUser(action.data);
      break;

    case SignupConstants.LOGIN_SUCCESS:
      SignupStore.emitChange();
      break;

    case SignupConstants.LOGIN_FAIL:
      // update(action.id, {complete: false});
      SignupStore.emitChange();
      break;

    case SignupConstants.LOGIN_AFTER:
      // update(action.id, {complete: false});
      SignupStore.emitChange();
      break;

    case SignupConstants.LOGOUT:
      // update(action.id, {complete: false});
      SignupStore.emitChange();
      break;

    default:
  }
});

module.exports = SignupStore;