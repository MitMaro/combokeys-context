// jscs:disable disallowAnonymousFunctions
/* eslint-disable no-unused-expressions */
'use strict';

var TagCallbackFilter = require('../../src/plugins/TagCallbackFilter');

describe('FilterFormInputs', function() {
	describe('#_attributesMatch', function() {
		var filter;

		before(function() {
			filter = new TagCallbackFilter([
				'a', 'B'
			]);
		});

		it('should disallow by tag lowercase input against lowercase tag', function() {
			expect(filter._attributesMatch(null, {
				tagName: 'a'
			})).to.True;
		});
		it('should disallow by tag uppercase input against lowercase tag', function() {
			expect(filter._attributesMatch(null, {
				tagName: 'A'
			})).to.True;
		});
		it('should disallow by tag uppercase input against uppercase tag', function() {
			expect(filter._attributesMatch(null, {
				tagName: 'B'
			})).to.True;
		});
		it('should disallow by tag lowercase input against uppercase tag', function() {
			expect(filter._attributesMatch(null, {
				tagName: 'b'
			})).to.True;
		});
		it('should allow by unregistered tag', function() {
			expect(filter._attributesMatch(null, {
				tagName: 'c'
			})).to.False;
		});
	});

	describe('ContextPlugin interface', function() {
		describe('#stopCallback', function() {
			it('should handle undefined stopCallback return', function() {
				var attributeMatchStub = sinon.stub();
				var filter = new TagCallbackFilter([]);

				filter._attributesMatch = attributeMatchStub;
				expect(filter.stopCallback()).to.be.undefined;
				expect(attributeMatchStub).to.not.be.called;
			});

			it('should handle true match stopCallback return', function() {
				var attributeMatchStub = sinon.stub().returns(true);
				var filter = new TagCallbackFilter([], {
					stopCallback: 'some value'
				});

				filter._attributesMatch = attributeMatchStub;
				expect(filter.stopCallback()).to.equal('some value');
				expect(attributeMatchStub).to.be.called;
			});

			it('should handle false match stopCallback return', function() {
				var attributeMatchStub = sinon.stub().returns(false);
				var filter = new TagCallbackFilter([], {
					stopCallback: 'some value'
				});

				filter._attributesMatch = attributeMatchStub;
				expect(filter.stopCallback()).to.be.undefined;
				expect(attributeMatchStub).to.be.called;
			});
		});

		describe('#preventDefault', function() {
			it('should handle undefined preventDefault return', function() {
				var attributeMatchStub = sinon.stub();
				var filter = new TagCallbackFilter([]);

				filter._attributesMatch = attributeMatchStub;
				expect(filter.preventDefault()).to.be.undefined;
				expect(attributeMatchStub).to.not.be.called;
			});

			it('should handle true match preventDefault return', function() {
				var attributeMatchStub = sinon.stub().returns(true);
				var filter = new TagCallbackFilter([], {
					preventDefault: 'some value'
				});

				filter._attributesMatch = attributeMatchStub;
				expect(filter.preventDefault()).to.equal('some value');
				expect(attributeMatchStub).to.be.called;
			});

			it('should handle false match preventDefault return', function() {
				var attributeMatchStub = sinon.stub().returns(false);
				var filter = new TagCallbackFilter([], {
					preventDefault: 'some value'
				});

				filter._attributesMatch = attributeMatchStub;
				expect(filter.preventDefault()).to.be.undefined;
				expect(attributeMatchStub).to.be.called;
			});
		});

		describe('#stopPropagation', function() {
			it('should handle undefined stopPropagation return', function() {
				var attributeMatchStub = sinon.stub();
				var filter = new TagCallbackFilter([]);

				filter._attributesMatch = attributeMatchStub;
				expect(filter.stopPropagation()).to.be.undefined;
				expect(attributeMatchStub).to.not.be.called;
			});

			it('should handle true match stopPropagation return', function() {
				var attributeMatchStub = sinon.stub().returns(true);
				var filter = new TagCallbackFilter([], {
					stopPropagation: 'some value'
				});

				filter._attributesMatch = attributeMatchStub;
				expect(filter.stopPropagation()).to.equal('some value');
				expect(attributeMatchStub).to.be.called;
			});

			it('should handle false match stopPropagation return', function() {
				var attributeMatchStub = sinon.stub().returns(false);
				var filter = new TagCallbackFilter([], {
					stopPropagation: 'some value'
				});

				filter._attributesMatch = attributeMatchStub;
				expect(filter.stopPropagation()).to.be.undefined;
				expect(attributeMatchStub).to.be.called;
			});
		});
	});
});

