var UserDispatcher = require('../dispatchers/user-dispatcher');
var UserConstants = require('../constants/user-constants');

module.exports = {
  fetchUser: function() {
    UserDispatcher.dispatch({
      actionType    : UserConstants.FETCH_USERS,
    });
  },
  editUser: function(text) {
    UserDispatcher.dispatch({
      actionType    : UserConstants.EDIT_USER,
      data          : data
    });
  },
  deleteUser: function(text) {
    UserDispatcher.dispatch({
      actionType    : UserConstants.DELETE_USER,
      data          : data
    });
  },
  showUser: function(text) {
    UserDispatcher.dispatch({
      actionType    : UserConstants.SHOW_USER,
      data          : data
    });
  },
};