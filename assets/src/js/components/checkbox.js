var React = require('react');
var ReactPropTypes = React.PropTypes;

module.exports = React.createClass({
  propTypes: {
    className: ReactPropTypes.string,
    id: ReactPropTypes.string
  },
  getInitialState: function() {
    return {
      value: this.props.value || ''
    };
  },
  _onChange: function(/*object*/ event) {
    this.setState({
      value: event.target.value
    });
  },

  render:function(){
    if(this.props.value == "true" || this.props.value == true){
      return (
        <input checked
          className={this.props.className}
          id={this.props.id}
          onChange={this._onChange}
          type={this.props.type}
          name={this.props.name}
        />
      );
    }else{
      return (
        <input
          className={this.props.className}
          id={this.props.id}
          onChange={this._onChange}
          type={this.props.type}
          name={this.props.name}
        />
      );
    }
  }
});