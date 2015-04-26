var React = require('react');
var UserListContainer = require('./user_list_container');
var UserStore = require('../../stores/user-store');
var UserActions = require('../../actions/user-action');
var Router = require('react-router')

function getUserState() {
  return {
     isLoaded: UserStore.isLoaded(),
     users: UserStore.findAll()
  };
}
var self = this;
module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.func
    },
    getInitialState: function() {
      var current_state = getUserState();
      if(!current_state.isLoaded)
        UserActions.fetchUser()
      return current_state
    },
    componentDidMount: function() {
        UserStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        UserStore.removeChangeListener(this._onChange);
    },
    render: function() {
        return < UserListContainer className= "user-list-contianer" isLoaded={this.state.isLoaded} users={this.state.users}/> ;
    },
    _onChange: function() {
      this.setState(getUserState());
    }
});