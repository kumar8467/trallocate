var UsersDispatcher = require('../dispatchers/user-dispatcher');
var EventEmitter = require('events').EventEmitter;
var UsersConstants = require('../constants/user-constants');
var request = require('superagent');
var assign = require('object-assign');
var Promise = require('promise');

var UsersStore;
var CHANGE_EVENT = 'change';
var UPDATE_EVENT = 'update';
var _users = {
  isLoaded: false,
  users: [],
  errorLoading: false,
};

var fetchUsers = function(){
  return new Promise(function(resolve,reject){
    request
    .get('http://localhost:3000/api/v1/users')
    .set('Accept', 'application/json')
    .end(function(err, res){
      var parsed_res = JSON.parse(res.text);
      if(err){
        reject(err)
      }else{
        _users.users = parsed_res.users;
        resolve(parsed_res)
      }
    });
  });
};

var getUserById= function(id){
  if(id && _users.isLoaded && _users.users && _users.users.length && !isNaN(id)){
    var users = _users.users
    for(var i=0; i < users.length; i++){
      if(users[i].id == id){
        return users[i];
      }
    }
  }else{
    return null
  }
}

var error = function(){
  _users.errorLoading = true;
  _users.isLoaded = false;
}

var loadingCompleted = function(){
  _users.errorLoading = false;
  _users.isLoaded = true;
}

var set = function(id,data){
  if(id && _users.isLoaded && _users.users && _users.users.length && !isNaN(id)){
    var users = _users.users;
    var user_found = false;
    for(var i=0; i < _users.users.length; i++){
      if(users[i].id == id){
        users[i] = data;
        user_found = true;
      }
    }
    if(!user_found){
      _users.users.push(data);
    }
  }else{
    return null
  }
}

var fetch = function(id){
  return new Promise(function(resolve,reject){
    request
    .get('http://localhost:3000/api/v1/users/'+id)
    .set('Accept', 'application/json')
    .end(function(err, res){
      try{
        var parsed_res = JSON.parse(res.text);
        if(err){
          reject(err);
        }else{
          set(id,parsed_res.user);
          resolve(parsed_res);
        }
      }catch(e){
        console.log('Error parsing user data');
      }
      
    });
  })
}

var updateUser = function(id,data){
  return new Promise(function(resolve,reject){
    request
    .put('http://localhost:3000/api/v1/users/'+id)
    .send(data)
    .set('Accept', 'application/json')
    .end(function(err, res){
      try{
        var parsed_res = JSON.parse(res.text);
        if(err){
          reject(err);
        }else{
          resolve(parsed_res);
        }
      }catch(e){
        console.log('Error parsing user data');
      }
      
    });
  })
}

UsersStore = assign({}, EventEmitter.prototype, {
  findAll: function(){
    return _users.users;
  },
  get: function(id){
    return getUserById(id);
  },
  fetch: function(id){
    return fetch(id);
  },
  isLoaded: function(){
    return _users.isLoaded;
  },
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },
  emitUpdateUserChange: function(){
    this.emit(UPDATE_EVENT);
  },
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  addUpdateListener: function(callback) {
    this.on(UPDATE_EVENT, callback);
  },
  removeUpdateListener: function(callback) {
    this.on(UPDATE_EVENT, callback);
  },
});

UsersDispatcher.register(function(action) {
  var text;
  switch(action.actionType) {
    case UsersConstants.FETCH_USERS:
      fetchUsers().then(
        function(data){
          loadingCompleted()
          UsersStore.emitChange();
        },
        function(err){
          error()
          UsersStore.emitChange();
        }
      );
      break;

    case UsersConstants.EDIT_USER:
      var data = {user: action.data.data}
      updateUser(action.data.id, data).then(
        function(data){
          UsersStore.emitUpdateUserChange();
        },
        function(err){
          error()
          UsersStore.emitUpdateUserChange();
        }
      );
      break;

    case UsersConstants.DELETE_USER:
      deleteUser(action.data);
      break;

    case UsersConstants.SHOW_USER:
      fetch(action.id).then(
        function(data){
          UsersStore.emitChange();
        },
        function(err){
          error()
          UsersStore.emitChange();
        }
      )
      break;

    default:
  }
});

module.exports = UsersStore;