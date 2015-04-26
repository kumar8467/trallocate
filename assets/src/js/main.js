var React = require('react');
var Router = require('react-router')
var DefaultRoute = Router.DefaultRoute;
var Route = Router.Route;
var Link = Router.Link;
var RouteHandler = Router.RouteHandler;
var Login = require('./components/login/login');
var Users = require('./components/admin/users');
var ShowUser = require('./components/admin/show_user');
var Signup = require('./components/signup/signup');
var EditUser = require('./components/admin/edit_user');
var LoginStore = require('./stores/login-store');
var LoginAction = require('./actions/login-action');

var getLoginState = function(){
  return { 
    authenticated: LoginStore.isAuthenticated(),
    authInProcess: LoginStore.authInProcess()
  };
}
var App = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  getInitialState: function(){
    LoginAction.authenticate();
    return getLoginState()
  },
  _onChange: function() {
    this.setState(getLoginState());
  },
  _onLogoutClick: function(){
    LoginAction.logout()
  },
  _onLogout: function(){
    document.cookie = "";
    this.context.router.transitionTo('/login')
    this.setState(getLoginState());
  },
  componentDidMount: function() {
    LoginStore.addChangeListener(this._onChange);
    LoginStore.addLogoutListener(this._onLogout);
  },

  componentWillUnmount: function() {
    LoginStore.removeChangeListener(this._onChange);
    LoginStore.removeLogoutListener(this._onLogout);
  },
  render: function () {
    var panel = [];
    if(!this.state.authInProcess){
      if(this.state.authenticated){
        panel.push(<li><Link to="users">Users</Link></li>)
        panel.push(<li><a class="" href="" onClick={this._onLogoutClick}>Logout</a></li>)
      }else{
        panel.push(<li><Link to="login">Login</Link></li>)
        panel.push(<li><Link to="signup">Signup</Link></li>)
      }
    }
    return (
      <div id="application">
        <div id="wrap">
          <div className={"navbar navbar-inverse navbar-fixed-top"} role="navigation">
            <div className={"container"}>
              <div className={"navbar-header"}>
                <button type="button" className={"navbar-toggle"} data-toggle="collapse" data-target=".navbar-collapse">
                  <span className={"sr-only"}>Toggle navigation</span>
                  <span className={"icon-bar"}></span>
                  <span className={"icon-bar"}></span>
                  <span className={"icon-bar"}></span>
                </button>
                <a className={"navbar-brand"} href="#">Trallocate</a>
              </div>
              <div className={"navbar-collapse collapse"}>
                <ul className={"nav navbar-nav"}>
                  {panel}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <RouteHandler/>

        <div id="footer">
          <div className={"container text-center"}>
            <div>© 2014 Company, Inc.</div>
            <div><strong>Trallocate.com</strong>.
              Created by<a href=""> Ritesh Kumar</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

var routes = (
  <Route name="app" path="/" handler={App}>
    <Route name="login" handler={Login} />
    <Route name="users" path="/users" handler={Users} />
      <Route name="showUser" path="users/:userId" handler={ShowUser} />
      <Route name="editUser" path="users/:userId/edit" handler={EditUser} />
    <Route name="signup" handler={Signup} />
  </Route>
);

Router.run(routes, Router.HistoryLocation, function (Handler) {
  React.render(<Handler/>, document.body);
});
