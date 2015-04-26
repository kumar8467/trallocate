var React = require('react');
var InputField = require('../common/input_field');
var InputButton = require('../common/button');
var SignupActions = require('../../actions/signup-action');


module.exports =  React.createClass({
  _onClick: function(event){
    event.preventDefault();
    username = event.target.elements.username.value;
    email = event.target.elements.email.value;
    password = event.target.elements.password.value;
    data = {username: username, password: password, email: email};
    SignupActions.signup(data);
  },
  render:function(){
    parentState = this.props.parentState
    parentClass = "container "
    if(parentState.signupAwaited){
      parentClass += "loader"
    }else if(parentState.totalReqMade && parentState.signupStatus){
      parentClass += "signup-success"
    }else if(parentState.totalReqMade && !parentState.signupStatus){
      parentClass += "error"
    }
    return (
      <div className={parentClass}>
        <div className="loading"></div>
        <div className="page-header">
          <h3>Sign up</h3>
        </div>
        <div className="col-sm-8 col-sm-offset-2 signup-form">
          <form className={this.props.className} id={this.props.id} onSubmit={this._onClick}>
            <div className={"form-group"}>
              <label className={"control-label"}>Username</label>
              <InputField id="username" className={"form-control"} placeholder="username" type="text" name="username" autofocus={"autofocus"} />
            </div>
            <div className="form-group">
              <label className={"control-label"}>Email</label>
              <InputField id="email" className={"form-control"} placeholder="Email" type="email" name="email" autofocus={"autofocus"} />
            </div>
            <div className="form-group">
              <label className={"control-label"}>Password</label>
              <InputField id="password" className={"form-control"} placeholder="password" type="password" name="password" autofocus={"autofocus"} />
            </div>
            <InputButton id="login-btn" className={"btn btn-primary"} value="Submit" value="Sign up" />
          </form>
          <div className="error-msg">Username or Email id already registered</div>
          <div className="col-sm-8 col-sm-offset-2 signup-success-msg">
            "Thanks for sign up. Email has been send to you for verification."
          </div>
        </div>
      </div>
    );
  }
});