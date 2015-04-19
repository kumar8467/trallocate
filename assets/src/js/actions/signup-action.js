var SignupDispatcher = require('../dispatchers/signup-dispatcher');
var SignupConstants = require('../constants/signup-constants');

module.exports = {
  signup: function(text) {
    SignupDispatcher.dispatch({
      actionType: SignupConstants.SIGNUP,
      data: data
    });
  },
};