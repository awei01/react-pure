'use strict';

describe('ReactPure.Forms', function() {

	var Forms;

	beforeEach(function() {

		Forms = ReactPure.Forms;

	});

	it('should be an object', function() {

		expect(Forms).toEqual(jasmine.any(Object));

	});

	describe('Control', function() {

		var Control;

		beforeEach(function() {

			Control = Forms.Control;

		});

		it('should be a React class', function() {

			expect(React.isValidClass(Control)).toBe(true);

		});

		describe('rendered into DOM', function() {

			var control;

			beforeEach(function() {

				control = ReactTestUtils.renderIntoDocument(Control({ id: "foo" }));

			});

			describe('prop validation', function() {

				beforeEach(function() {

					spyOn(console, 'warn');

				});

				it('when id set to null, it should call console.warn()', function() {

					control.setProps({ id: null });

					expect(console.warn).toHaveBeenCalled();

				});

				it('when id set to object, it should call console.warn()', function() {

					control.setProps({ id: {} });

					expect(console.warn).toHaveBeenCalled();

				});

			});

			describe('with defaults', function() {

				var input;

				beforeEach(function() {

					input = ReactTestUtils.findRenderedComponentWithType(control, React.DOM.input);

				});

				it('should be a React.DOM.input', function() {

					// no error should be thrown;

				});

				it('should have input.props.name set to id', function() {

					expect(input.props.name).toBe('foo');

				});

				it('should have input.props.type set to text', function() {

					expect(input.props.type).toBe('text');

				});

			});

			describe('other input-related props set', function() {

				var input;

				beforeEach(function() {

					control.setProps({ placeholder: "foo", disabled: true });

					input = ReactTestUtils.findRenderedComponentWithType(control, React.DOM.input);

				});

				it('should have props.placeholder set', function() {

					expect(input.props.placeholder).toBe('foo');

				});

				it('should have props.disabled set', function() {

					expect(input.props.disabled).toBe(true);

				});

			});

			it('when props.type set to textarea, should be a React.DOM.textarea', function() {

				var textarea;

				control.setProps({ type: "textarea" });

				textarea = ReactTestUtils.findRenderedComponentWithType(control, React.DOM.textarea);

			});

		});

	});

	describe('Base', function() {

		var Base;

		beforeEach(function() {

			Base = Forms.Base;

		});

		it('should be a React class', function() {

			expect(React.isValidClass(Base)).toBe(true);

		});

		describe('rendered into DOM', function() {

			var base;

			beforeEach(function() {

				base = ReactTestUtils.renderIntoDocument(Base());

			});

			describe('props validation', function() {

				beforeEach(function() {

					spyOn(console, 'warn');

				});

				it('when props.tree set to object, it should call console.warn()', function() {

					base.setProps({ tree: {} });

					expect(console.warn).toHaveBeenCalled();

				});

				it('when props.tree set to string, it should call console.warn()', function() {

					base.setProps({ tree: "invalid" });

					expect(console.warn).toHaveBeenCalled();

				});

				it('when props.model set to array, it should call console.warn()', function() {

					base.setProps({ model: [] });

					expect(console.warn).toHaveBeenCalled();

				});

				it('when props.model set to string, it should call console.warn()', function() {

					base.setProps({ model: "invalid" });

					expect(console.warn).toHaveBeenCalled();

				});

			});

			describe('rendered React.DOM.form', function() {

				var form;

				beforeEach(function() {

					form = ReactTestUtils.findRenderedComponentWithType(base, React.DOM.form);

				});

				describe('form.props', function() {

					it('form should have props.className as pure-form', function() {

						expect(form.props.className).toBe('pure-form');

					});

					it('form should have props.children as undefined', function() {

						expect(form.props.children).toBe(undefined);

					});

					it('when base.props.className is changed, it should append to form.props.className', function() {

						base.setProps({ className: "foo" });

						expect(form.props.className).toBe('pure-form foo');

					});

					it('when base.props set with keys, should transfer all, append .className and omit .tree, .model and .on* callbacks', function() {

						base.setProps({ id: "foo", disabled: true, tree: [], model: {}, onChange: function() {}, onClick: function() {} });

						expect(form.props).toEqual({ className: "pure-form", id: "foo", disabled: true, children: undefined });

					});

				});

			});

			describe('props.tree set to array with a React component', function() {

				var div;

				beforeEach(function() {

					base.setProps({ tree: [React.DOM.div(null, 'some content')] });

					div = ReactTestUtils.findRenderedDOMComponentWithTag(base, 'div');

				});

				it('should render the React component', function() {

					expect(div.props.children).toBe('some content');

				});

			});

			describe('props.onChange set with callback and tree has inputs', function() {

				var spyOnChange, $inputs;

				beforeEach(function() {

					spyOnChange = jasmine.createSpy('spy on change');

					base.setProps({
						tree: [{ id: "foo" }, { id: "bar.baz" }],
						onChange: spyOnChange
					});

					$inputs = $(base.getDOMNode()).find('input');

				});

				it('should have 2 controls', function() {

					expect($inputs.length).toBe(2);

				});

				it('when first element changed, it should call props.onChange with id and value', function() {

					var $first = $inputs.eq(0);
					$first.val('changed foo');

					ReactTestUtils.Simulate.change($first[0]);

					expect(spyOnChange).toHaveBeenCalledWith('foo', 'changed foo');

				});

				it('when last element changed, it should call props.onChange with id and value', function() {

					var $last = $inputs.eq(1);
					$last.val('changed bar.baz');

					ReactTestUtils.Simulate.change($last[0]);

					expect(spyOnChange).toHaveBeenCalledWith('bar.baz', 'changed bar.baz');

				});

			});

			describe('props.tree set to array of input props objects', function() {

				var tree;

				beforeEach(function() {

					tree = [
						{ id: "foo" },
						{ id: "bar" }
					];

					base.setProps({ tree: tree });

				});

				describe('ReactPure.Control children', function() {

					var controls;

					beforeEach(function() {

						controls = ReactTestUtils.scryRenderedComponentsWithType(base, Forms.Control);

					});

					it('should have 2 controls', function() {

						expect(controls.length).toBe(2);

					});

					it('first control should have props.id of tree[0].id', function() {

						expect(controls[0].props.id).toBe('foo');

					});

					it('first control should have props.key of 0', function() {

						expect(controls[0].props.key).toBe(0);

					});

					it('first control should have props.onChange as a function', function() {

						expect(controls[0].props.onChange).toEqual(jasmine.any(Function));

					});

					it('last control should have props.id of tree[1].id', function() {

						expect(controls[1].props.id).toBe('bar');

					});

					it('last control should have props.key of 1', function() {

						expect(controls[1].props.key).toBe(1);

					});

					it('last control should have props.onChange as a function', function() {

						expect(controls[1].props.onChange).toEqual(jasmine.any(Function));

					});

				});

				describe('with props.id set, ReactPure.Control children', function() {

					var controls;

					beforeEach(function() {

						base.setProps({ id: "formId" });

						controls = ReactTestUtils.scryRenderedComponentsWithType(base, Forms.Control);

					});

					it('should have 2 controls', function() {

						expect(controls.length).toBe(2);

					});

					it('first control should have props.id of tree[0] prepended with props.id and underscore', function() {

						expect(controls[0].props.id).toEqual('formId_foo');

					});

					it('last control should have props of tree[1] prepended with props.id and underscore', function() {

						expect(controls[1].props.id).toEqual('formId_bar');

					});

				});

			});

			describe('with props.id, .tree and .model set, ReactPure.Control children', function() {

				var tree, model, controls;

				beforeEach(function() {

					tree = [
						{ id: "foo" },
						{ id : "bar.baz" },
						{ id : "boo" }
					];

					model = {
						foo: "foo value",
						bar: {
							baz: "bar.baz value"
						}
					};

					base.setProps({ id: "formId", tree: tree, model: model });

					controls = ReactTestUtils.scryRenderedComponentsWithType(base, Forms.Control);

				});

				it('should have 3 controls', function() {

					expect(controls.length).toBe(3);

				});

				it('should pass retrieved value from model based on the input.id to props.value', function() {

					expect(controls[0].props.value).toBe('foo value');

				});

			});

		});

	});

});