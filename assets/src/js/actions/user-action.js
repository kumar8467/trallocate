var LoginDispatcher = require('../dispatchers/login-dispatcher');
var LoginConstants = require('../constants/login-constants');

module.exports = {
  signup: function(text) {
    LoginDispatcher.dispatch({
      actionType: LoginConstants.SIGNUP,
      data: data
    });
  },
};