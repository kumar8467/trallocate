var UsersDispatcher = require('../dispatchers/user-dispatcher');
var EventEmitter = require('events').EventEmitter;
var UsersConstants = require('../constants/user-constants');
var request = require('superagent');
var assign = require('object-assign');
var UsersStore;
var CHANGE_EVENT = 'change';
var _user = {
  is_loaded: false,
  users: null,
  error_loading: false,
};


var fetchUsers = function(){
  request
  .get('http://localhost:3000/api/v1/users')
  .set('Accept', 'application/json')
  .end(function(err, res){
    var parsed_res = JSON.parse(res.text);
    if(err){
      _user.error_loading   = true;
      _user.is_loaded       = false;
    }else{
      _user.error_loading   = false;
      _user.is_loaded       = true;
      _user.users           = parsed_res.users;
    }
    UsersStore.emitChange();
  });
};

UsersStore = assign({}, EventEmitter.prototype, {
  getUsers: function(){
    return _user.users;
  },
  getUserById: function(id){
    if(id && _user.isLoaded && _user.users && _user.users.length && !isNaN(id)){
      var users = _user.users
      for(var i=0; i < users.length; i++){
        if(users[i].id == id){
          return users[i];
        }
      }
    }else{
      return null
    }
  },
  isLoaded: function(){
    return _user.is_loaded;
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

UsersDispatcher.register(function(action) {
  var text;
  switch(action.actionType) {
    case UsersConstants.FETCH_USERS:
      fetchUsers();
      break;

    case UsersConstants.EDIT_USER:
      editUser(action.data);
      break;

    case UsersConstants.DELETE_USER:
      deleteUser(action.data);
      break;

    case UsersConstants.SHOW_USER:
      showUser(action.data);
      break;

    default:
  }
});

module.exports = UsersStore;