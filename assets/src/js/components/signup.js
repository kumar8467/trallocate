var React = require('react');
var SignupForm = require('./signup_form');
var SignupStore = require('../stores/signup-store');
var Router = require('react-router')

var getLoginState = function() {
  return {
    authentication_awaited: SignupStore.emailSent(),
    error: SignupStore.signupError()
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
        SignupStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        SignupStore.removeChangeListener(this._onChange);
    },
    render: function() {
        return (
            < SignupForm id = "signupForm" authentication_awaited={this.state.authentication_awaited} error={this.state.error}/>
        );
    },
    _onChange: function() {
        this.setState(getLoginState());
    }
});