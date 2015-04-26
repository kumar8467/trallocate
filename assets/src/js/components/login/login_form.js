var React = require('react');
var InputField = require('../common/input_field');
var InputButton = require('../common/button');
var LoginActions = require('../../actions/login-action');


module.exports =  React.createClass({
	_onClick: function(event){
		event.preventDefault();
		username = event.target.elements.username.value;
		password = event.target.elements.password.value;
		data = {username: username, password: password};
		LoginActions.signin(data);
	},
	render:function(){
		parentState = this.props.parentState
		parentClass = "container "
		if(parentState.loginAwaited){
			parentClass += "loader"
		}else if(parentState.totalLoginReqMade && !parentState.loginStatus){
			parentClass += "error"
		}
		return (
			<div className={parentClass}>
				<div className="loading"></div>
				<div className="page-header">
				    <h3>Sign in</h3>
				</div>
				<div className="col-sm-8 col-sm-offset-2">
		        	<form className={this.props.className} id={this.props.id} onSubmit={this._onClick}>
		     			<div className={"form-group"}>
				        <label className={"control-label"}>Username or Email</label>
				        <InputField id="username" className={"form-control"} placeholder="username" type="text" name="username" autofocus={"autofocus"} />
				      </div>
				      <div className="form-group">
				        <label className={"control-label"}>Password</label>
				        <InputField id="password" className={"form-control"} placeholder="password" type="password" name="password" autofocus={"autofocus"} />
				      </div>
				      <InputButton id="login-btn" className={"btn btn-primary"} value="Submit" value="Sign in" />
					</form>
					<div className="error-msg">Username or Password incorrect</div>
				</div>
			</div>
		);
	}
});