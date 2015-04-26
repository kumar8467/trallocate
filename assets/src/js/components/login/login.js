var React = require('react');
var LoginForm = require('./login_form');
var LoginStore = require('../../stores/login-store');
var Router = require('react-router')

function getLoginState() {
  return {
    authenticated       : LoginStore.isAuthenticated(),
    loginAwaited        : LoginStore.loginInProcess(),
    loginStatus         : LoginStore.loginStatus(),
    totalLoginReqMade   : LoginStore.totalLoginReqMade(),
  };
}
var self = this;
module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.func
    },
    getInitialState: function() {
        var state = getLoginState()
        if(state.authenticated)
            this.context.router.transitionTo('/users')
        return state
    },
    componentDidMount: function() {
        LoginStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        LoginStore.removeChangeListener(this._onChange);
    },
    render: function() {
        return ( 
            < LoginForm id = "loginForm" parentState={this.state}/> 
        );
    },
    _onChange: function() {
        login_state = getLoginState();
        if(login_state && login_state.authenticated){
            this.context.router.transitionTo('/users');
        }else{
            this.setState(login_state);
        }
    }
});