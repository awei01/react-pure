'use strict';

describe('ReactPure namspace', function() {

	it('should be an object', function() {

		expect(ReactPure).toEqual(jasmine.any(Object));

	});

	describe('.add()', function() {

		it('passed simple key and value should create key with value on ReactPure', function() {

			ReactPure.add('key', 'value');

			expect(ReactPure.key).toBe('value');

		});

		it('passed key that already exists should throw exception', function() {

			var exception = function() {
				ReactPure.add('key', 'value');
				ReactPure.add('key', 'other value');
			};

			expect(exception).toThrow();

		});

		it('passed dot.key and value should create nested key with value on ReactPure', function() {

			ReactPure.add('foo.bar.baz', 'value');

			expect(ReactPure.foo.bar.baz).toBe('value');

		});

		it('passed dot.key that already exists should throw exception', function() {

			var exception = function() {
				ReactPure.add('foo.bar.baz', 'value');
				ReactPure.add('foo.bar.baz', 'other value');
			};

			expect(exception).toThrow('ReactPure [foo.bar.baz] already exists');

		});

	});

});