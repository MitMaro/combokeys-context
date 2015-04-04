// jscs:disable disallowAnonymousFunctions
/* eslint-disable no-unused-expressions */
'use strict';

var StaticPlugin = require('../../src/plugins/StaticFilter');

describe('Static Plugin', function() {
	it('returns what you give it', function() {
		var plugin = new StaticPlugin(
			'a', 'b', 'c'
		);

		expect(plugin.stopCallback()).to.equal('c');
		expect(plugin.stopPropagation()).to.equal('b');
		expect(plugin.preventDefault()).to.equal('a');
	});
});

