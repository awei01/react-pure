/** @jsx React.DOM */
(function (ReactPure) {
'use strict';

var Forms = {};

Forms.Control = React.createClass({

	propTypes: {

		id: React.PropTypes.string.isRequired

	},

	render: function() {

		var props = this.props,
			defaults, passedProps, dom;

		if (!props.id) {
			return (
				<span>invalid props passed to ReactPure.Control</span>
			);
		}

		defaults = {
			name: props.id,
			type: "text"
		};

		passedProps = _.assign({}, defaults, props);

		dom = props.type === 'textarea' ? 'textarea' : 'input';

		return (
			React.DOM[dom](passedProps)
		);

	}

});

Forms.Base = React.createClass({

	propTypes: {

		tree: React.PropTypes.array,
		model: React.PropTypes.object

	},

	retrieveModelValue: function(key) {

		var result;

		try {
			result = eval('this.props.model.' + key);
		} catch (exception) {
			result = null;
		}

		return result;
	},

	handleChange: function(id, event) {

		var callback = this.props.onChange;

		if (callback) {
			callback(id, event.target.value);
		}

	},

	renderContents: function() {

		var tree = this.props.tree;

		if (!_.isArray(tree) || !tree.length) {
			return;
		}

		return tree.map(this.renderLeaf);
	},

	renderLeaf: function(element, index) {

		var elementId, idPrefix = this.props.id ? this.props.id + '_' : '',
			modelValue, passedProps;

		if (React.isValidComponent(element)) {
			element.props.key = index;
			return element;
		};

		elementId = element.id;

		if (!elementId) {
			return;
		}

		passedProps = _.assign({}, { key: index, value: modelValue }, element);

		passedProps.onChange = this.handleChange.bind(this, elementId);

		modelValue = this.retrieveModelValue(elementId);

		if (modelValue) {
			passedProps.value = modelValue;
		}

		passedProps.id = idPrefix + passedProps.id;

		return Forms.Control(passedProps);

	},

	render: function() {
		var passedProps = _.omit(this.props, this.omitPassedProps),
			contents = this.renderContents();

		passedProps.className = 'pure-form' + (passedProps.className ? ' ' + passedProps.className : '');

		return (
			React.DOM.form(passedProps, contents)
		);

	},

	omitPassedProps: function(value, name) {

		return name.match(/^(tree|model|on[A-Z]{1}[A-Za-z]+)$/);

	}

});



ReactPure.add('Forms', Forms);

} (this.ReactPure));