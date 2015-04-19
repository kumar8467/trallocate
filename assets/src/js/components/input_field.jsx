var React = require('react');
var ReactPropTypes = React.PropTypes;

module.exports = React.createClass({
	propTypes: {
		className: ReactPropTypes.string,
		id: ReactPropTypes.string,
		placeholder: ReactPropTypes.string,
		value: ReactPropTypes.string
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
		return (
			<input
				className={this.props.className}
				id={this.props.id}
				placeholder={this.props.placeholder}
				onBlur={this._save}
				onChange={this._onChange}
				onKeyDown={this._onKeyDown}
				value={this.state.value}
				autoFocus={true}
				type={this.props.type}
				name={this.props.name}
			/>
		);
	}
});