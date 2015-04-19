var React = require('react');
var ReactPropTypes = React.PropTypes;

module.exports = React.createClass({
	propTypes: {
		className: ReactPropTypes.string,
		id: ReactPropTypes.string,
		value: ReactPropTypes.string
	},
	render:function(){
		return (
			<input
				className={this.props.className}
				id={this.props.id}
				value={this.props.value}
				type="submit"
				onClick={this.props._onClick}
			/>
		);
	}
});