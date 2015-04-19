var React = require('react');
var SignupForm = require('./signup_form.jsx');
var SignupStore = require('../stores/signup-store');
var Router = require('react-router')

function getLoginState() {
  return {
    authentication_awaited: SignupStore.isAuthenticated(),
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
            < div >
                < SignupForm id = "signupForm" authentication_awaited={this.state.authentication_awaited} error={this.state.error}/>
            < /div>
        );
    },
    _onChange: function() {
        this.setState(getLoginState());
    }
});