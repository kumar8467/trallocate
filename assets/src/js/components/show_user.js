var React = require('react');
var UserActions = require('../actions/user-action');
var UserStore = require('../stores/user-store');

function getUserState(id) {
  return {
     user_id: id,
     user: UserStore.get(id)
  };
}
var self = this;
module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.func
    },
    getInitialState: function() {
      var params = this.context.router.getCurrentParams();
      var id = parseInt(params.userId);
      var current_state = getUserState(id);
      if(!current_state.isLoaded)
        UserActions.showUser(id)
      return current_state
    },
    componentDidMount: function() {
        UserStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        UserStore.removeChangeListener(this._onChange);
    },
    render:function(){
      var user = this.state.user;
      return (
        <div className={this.state.user ? "show-user container" : "show-user container loading"}>
          <h2>User</h2>
          <div className="loader"> Loading ... </div>
          <table className="table table-bordered table-striped">
            <tbody>
              <tr>
                <td>Id</td>
                <td>{user.id}</td>
              </tr>
              <tr>
                <td>Username</td>
                <td>{user.username}</td>
              </tr>
               <tr>
                <td>Email</td>
                <td>{user.email}</td>
              </tr>
              <tr>
                <td>Active</td>
                <td>{user.active.toString()}</td>
              </tr>
              <tr>
                <td>Admin</td>
                <td>{user.admin.toString()}</td>
              </tr>
              <tr>
                <td>Location</td>
                <td>{user.location}</td>
              </tr>
              <tr>
                <td>Created Date</td>
                <td>{user.createdAt}</td>
              </tr>
              <tr>
                <td>Updated Date</td>
                <td>{user.updatedAt}</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    },
    _onChange: function() {
      this.setState(getUserState());
    }
});

