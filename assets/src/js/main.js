var React = require('react');
var Router = require('react-router')
var DefaultRoute = Router.DefaultRoute;
var Route = Router.Route;
var Link = Router.Link;
var RouteHandler = Router.RouteHandler;
var Login = require('./components/login');
var Users = require('./components/users');
// var ShowUsers = require('./components/show_user');
var Signup = require('./components/signup');

var App = React.createClass({
  render: function () {
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
                  <li><Link to="users">Users</Link></li>
                  <li><Link to="login">Login</Link></li>
                  <li><Link to="signup">Signup</Link></li>
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
    <Route name="users" handler={Users} />
    <Route name="signup" handler={Signup} />
  </Route>
);

Router.run(routes, Router.HistoryLocation, function (Handler) {
  React.render(<Handler/>, document.body);
});
