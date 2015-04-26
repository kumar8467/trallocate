var React = require('react');
var UserActions = require('../../actions/user-action');
var Router = require('react-router')
var Link = Router.Link;
var RouteHandler = Router.RouteHandler;

var NoUserFound = React.createClass({
  render:function(){
    return <tr> <td colspan="3" className="warning">No content</td> </tr>
  }
});

var UserListItem = React.createClass({
  render:function(){
    user = this.props.user;
    return (
      <tr>
        <td>{user.id}</td>
        <td>{user.username}</td>
        <td>{user.email}</td>
        <td>{user.active.toString()}</td>
        <td>{user.admin.toString()}</td>
        <td>
          <Link to="showUser" params={{userId: user.id}}>Show</Link>
          <Link to="editUser" params={{userId: user.id}}>Edit</Link>
        </td>
      </tr>
    );
  }
});

module.exports =  React.createClass({
  render:function(){
    var users = this.props.users;
    var users_list = [];
    if(!this.props.isLoaded){
      return <h1> Loading...</h1>;
    }
    if(!(users && users.length)){
      users_list.push(<NoUserFound />)
    }
    return (
      <div className="container">
        <h2>Users</h2>
        <table className="table table-bordered table-striped">
          <thead>
            <th>Id</th>
            <th>Username</th>
            <th>Email</th>
            <th>Active</th>
            <th>Admin</th>
            <th>Actions</th>
          </thead>
          <tbody>
            {users.map(function(user){return <UserListItem user={user} />})}
          </tbody>
        </table>
      </div>
    );
  }
});

/*
<Link to="edit" params={{userId: user.id}}>Edit</Link>
*/