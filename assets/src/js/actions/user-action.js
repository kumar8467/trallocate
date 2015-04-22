var UserDispatcher = require('../dispatchers/user-dispatcher');
var UserConstants = require('../constants/user-constants');

module.exports = {
  fetchUser: function() {
    UserDispatcher.dispatch({
      actionType    : UserConstants.FETCH_USERS,
    });
  },
  editUser: function(data) {
    UserDispatcher.dispatch({
      actionType    : UserConstants.EDIT_USER,
      data          : data
    });
  },
  deleteUser: function(data) {
    UserDispatcher.dispatch({
      actionType    : UserConstants.DELETE_USER,
      data          : data
    });
  },
  showUser: function(id) {
    UserDispatcher.dispatch({
      actionType    : UserConstants.SHOW_USER,
      id          : id
    });
  },
};