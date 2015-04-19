var LoginDispatcher = require('../dispatchers/login-dispatcher');
var LoginConstants = require('../constants/login-constants');

module.exports = {
  signin: function(text) {
    LoginDispatcher.dispatch({
      actionType: LoginConstants.LOGIN,
      data: data
    });
  },
};