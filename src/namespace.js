(function() {
'use strict';

var ReactPure = {};

ReactPure.add = function(key, value)
{
	var parts = key.split('.'),
		obj = this,
		current,
		last = parts.pop();

	while (parts.length) {
		current = parts.shift();

		if (typeof obj[current] === 'undefined')
		{
			obj[current] = {};
		}

		obj = obj[current];
	}


	if (typeof obj[last] !== 'undefined') {
		throw 'ReactPure [' + key + '] already exists';
	}

	obj[last] = value;
}

this.ReactPure = ReactPure;

}).call(this);