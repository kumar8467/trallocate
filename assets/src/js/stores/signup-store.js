var SignupDispatcher = require('../dispatchers/signup-dispatcher');
var EventEmitter = require('events').EventEmitter;
var SignupConstants = require('../constants/signup-constants');
var request = require('superagent');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';
var model = {
  signupAwaited   : false,
  signupStatus    : false,
  requestCount    : 0
};

var signup_request = function(data){
  model.signupAwaited = true;
  model.requestCount += 1;
  request
  .post('http://localhost:3000/api/v1/signup')
  .send(data)
  .set('Accept', 'application/json')
  .end(function(err, res){
    if(err){
      model.signupStatus = false;
    }else{
      model.signupStatus = true;
    }
    model.signupAwaited = false;
    SignupStore.emitChange();
  });
};

SignupStore = assign({}, EventEmitter.prototype, {
  signupStatus: function(){
    return model.signupStatus;
  },

  signupInProgress: function(){
    return model.signupAwaited;
  },

  totalReqMade: function(){
    return model.requestCount;
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
      signup_request(action.data);
      SignupStore.emitChange();
      break;

    default:
  }
});

module.exports = SignupStore;