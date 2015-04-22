var React = require('react');
var UserActions = require('../actions/user-action');
var UserStore = require('../stores/user-store');
var InputField = require('./input_field');
var InputButton = require('./button');
var Checkbox = require('./checkbox');

function getUserState(id) {
  return {
     user_id: id,
     user: UserStore.get(id)
  };
}

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
        UserStore.addUpdateListener(this._onUpdateUser);
    },

    componentWillUnmount: function() {
        UserStore.removeChangeListener(this._onChange);
        UserStore.removeUpdateListener(this._onUpdateUser);
    },
    _onClick: function(event){
        event.preventDefault();
        var data = {
            username    : event.target.elements.username.value,
            email       : event.target.elements.email.value,
            admin       : event.target.elements.admin.checked,
            active      : event.target.elements.active.checked,
            location    : event.target.elements.location.value
        };
        UserActions.editUser({data: data, id: this.state.user_id});
    },
    render:function(){
      var user = this.state.user;
      return (
        <div id={user ? "edit-user" : "edit-user loading"} className="container">
            <h3>Edit Person Template</h3>
            <form onSubmit={this._onClick}>
                <div className={"form-group"}>
                    <label className={"control-label"}>Username</label>
                    <InputField id="username" className={"form-control"} placeholder="username" type="text" name="username" value={user.username} />
                </div>
                <div className="form-group">
                    <label className={"control-label"}>Email</label>
                    <InputField id="email" className={"form-control"} placeholder="Email" type="email" name="email" value={user.email}/>
                </div>
                <div className="form-group">
                    <label className={"control-label"}>Active</label>
                    <Checkbox id="active" className={"form-control"} name="active" type="checkbox" value={user.active}/>
                </div>
                <div className="form-group">
                    <label className={"control-label"}>Admin</label>
                    <Checkbox id="admin" className={"form-control"} name="admin" type="checkbox" value={user.admin}/>
                </div>
                <div className="form-group">
                    <label className={"control-label"}>Location</label>
                    <InputField id="location" className={"form-control"} placeholder="Location" type="text" name="location" value={user.location}/>
                </div>
                <InputButton id="login-btn" className={"btn btn-primary"} value="Submit" value="Save" />
            </form>
            <div className="loader"> Loading... </div>
        </div>
      );
    },
    _onChange: function() {
      this.setState(getUserState(this.state.user_id));
    },
    _onUpdateUser: function() {
      this.context.router.transitionTo('users');
    }
});

