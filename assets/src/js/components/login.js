var React = require('react');
var LoginForm = require('./login_form');
var LoginStore = require('../stores/login-store');
var Router = require('react-router')

function getLoginState() {
  return {
     authenticated: LoginStore.isAuthenticated(),
  };
}
var self = this;
module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.func
    },
    getInitialState: function() {
      return getLoginState()
    },
    componentDidMount: function() {
        LoginStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        LoginStore.removeChangeListener(this._onChange);
    },
    render: function() {
        return ( 
            < div >
                < LoginForm id = "loginForm" authenticated={this.state.authenticated}/> 
            < /div>
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