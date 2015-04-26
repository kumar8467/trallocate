var React = require('react');
var ReactPropTypes = React.PropTypes;

module.exports = React.createClass({
  propTypes: {
    className: ReactPropTypes.string,
    id: ReactPropTypes.string
  },
  getInitialState: function() {
    return {
      value: this.props.value
    };
  },
  _onChange: function(event) {
    this.setState({value: event.currentTarget.checked})
  },

  render:function(){
    if(this.state.value == "true" || this.state.value == true){
      return (
        <input checked
          className={this.props.className}
          id={this.props.id}
          onChange={this._onChange}
          type={this.props.type}
          name={this.props.name}/>
      );
    }else if (this.state.value == "false" || this.state.value == false){
      return (
        <input
          className={this.props.className}
          id={this.props.id}
          onChange={this._onChange}
          type={this.props.type}
          name={this.props.name}/>
      );
    }
  }
});