
describe('isArray', function() {
	describe('with builtin Array.isArray', function() {
		var actualIsArray;
		var isArray;
		before(function() {
			actualIsArray = Array.isArray;
			Array.isArray = 'my built in value';
			delete require.cache[require.resolve('../../src/util/isArray')];
			isArray = require('../../src/util/isArray');
		});

		it('uses builtin', function() {
			var isArray = require('../../src/util/isArray');
			expect(isArray).to.equal(Array.isArray);
		});

		after(function() {
			Array.isArray = actualIsArray;
			delete require.cache[require.resolve('../../src/util/isArray')];
		});
	});

	describe('with missing Array.isArray', function() {
		var actualIsArray;
		var isArray;
		before(function() {
			actualIsArray = Array.isArray;
			Array.isArray = false;
			delete require.cache[require.resolve('../../src/util/isArray')];
			isArray = require('../../src/util/isArray');
		});

		it('polyfills when Array.isArray it missing', function() {
			expect(isArray).to.not.equal(actualIsArray);
		});

		it('returns true on array', function() {
			expect(isArray([])).to.be.true;
		});

		it('returns false on object', function() {
			expect(isArray({})).to.be.false;
		});

		it('returns false on string', function() {
			expect(isArray('')).to.be.false;
		});

		it('returns false on number', function() {
			expect(isArray(1)).to.be.false;
		});

		after(function() {
			Array.isArray = actualIsArray;
			delete require.cache[require.resolve('../../src/util/isArray')];
		});
	});
});

