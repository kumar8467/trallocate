var LoginDispatcher = require('../dispatchers/login-dispatcher');
var LoginConstants = require('../constants/login-constants');

module.exports = {
  signin: function(text) {
    LoginDispatcher.dispatch({
      actionType: LoginConstants.LOGIN,
      data: data
    });
  },
  authenticate: function(){
  	LoginDispatcher.dispatch({
      actionType: LoginConstants.AUTHENTICATE,
    });
  },
  logout: function(){
  	LoginDispatcher.dispatch({
      actionType: LoginConstants.LOGOUT,
    });
  }
};