// jscs:disable disallowAnonymousFunctions, requirePaddingNewLinesInObjects
/* eslint-disable no-unused-expressions */
'use strict';

var ClassNameFilter = require('../../src/plugins/ClassNameFilter');

describe('ClassNameFilter', function() {
	var elementStub;

	beforeEach(function() {
		elementStub = {
			className: ''
		};
	});

	describe('#_attributesMatch', function() {

		it('should handle empty classname', function() {
			var filter = new ClassNameFilter([]);

			elementStub.className = '';
			expect(filter._attributesMatch(elementStub)).to.be.undefined;
		});

		describe('with matchAll option', function() {
			var options;

			beforeEach(function() {
				options = {
					matchAll: true
				};
			});

			it('should handle a single simple classname', function() {
				var filter = new ClassNameFilter(['b'], options);

				elementStub.className = 'b';
				expect(filter._attributesMatch(elementStub)).to.be.true;
			});

			it('should handle a multiple simple missing classname', function() {
				var filter = new ClassNameFilter(['a', 'b'], options);

				elementStub.className = 'b c d';
				expect(filter._attributesMatch(elementStub)).to.be.false;
			});

			it('should handle a multiple simple classname', function() {
				var filter = new ClassNameFilter(['a', 'b'], options);

				elementStub.className = 'c d a b f';
				expect(filter._attributesMatch(elementStub)).to.be.true;
			});
		});
		describe('without matchAll option', function() {
			it('should handle a single simple classname', function() {
				var filter = new ClassNameFilter(['b']);

				elementStub.className = 'b';
				expect(filter._attributesMatch(elementStub)).to.be.true;
			});

			it('should handle a multiple simple missing classname', function() {
				var filter = new ClassNameFilter(['a', 'b']);

				elementStub.className = 'b c d';
				expect(filter._attributesMatch(elementStub)).to.be.true;
			});

			it('should handle a missing classname', function() {
				var filter = new ClassNameFilter(['a', 'b']);

				elementStub.className = 'c d f e';
				expect(filter._attributesMatch(elementStub)).to.be.false;
			});
		});
	});

	describe('ContextPlugin interface', function() {
		describe('#stopCallback', function() {
			it('should handle undefined stopCallback return', function() {
				var attributeMatchStub = sinon.stub();
				var filter = new ClassNameFilter([]);

				filter._attributesMatch = attributeMatchStub;
				expect(filter.stopCallback()).to.be.undefined;
				expect(attributeMatchStub).to.not.be.called;
			});

			it('should handle true match stopCallback return', function() {
				var attributeMatchStub = sinon.stub().returns(true);
				var filter = new ClassNameFilter([], {
					stopCallback: 'some value'
				});

				filter._attributesMatch = attributeMatchStub;
				expect(filter.stopCallback()).to.equal('some value');
				expect(attributeMatchStub).to.be.called;
			});

			it('should handle false match stopCallback return', function() {
				var attributeMatchStub = sinon.stub().returns(false);
				var filter = new ClassNameFilter([], {
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
				var filter = new ClassNameFilter([]);

				filter._attributesMatch = attributeMatchStub;
				expect(filter.preventDefault()).to.be.undefined;
				expect(attributeMatchStub).to.not.be.called;
			});

			it('should handle true match preventDefault return', function() {
				var attributeMatchStub = sinon.stub().returns(true);
				var filter = new ClassNameFilter([], {
					preventDefault: 'some value'
				});

				filter._attributesMatch = attributeMatchStub;
				expect(filter.preventDefault()).to.equal('some value');
				expect(attributeMatchStub).to.be.called;
			});

			it('should handle false match preventDefault return', function() {
				var attributeMatchStub = sinon.stub().returns(false);
				var filter = new ClassNameFilter([], {
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
				var filter = new ClassNameFilter([]);

				filter._attributesMatch = attributeMatchStub;
				expect(filter.stopPropagation()).to.be.undefined;
				expect(attributeMatchStub).to.not.be.called;
			});

			it('should handle true match stopPropagation return', function() {
				var attributeMatchStub = sinon.stub().returns(true);
				var filter = new ClassNameFilter([], {
					stopPropagation: 'some value'
				});

				filter._attributesMatch = attributeMatchStub;
				expect(filter.stopPropagation()).to.equal('some value');
				expect(attributeMatchStub).to.be.called;
			});

			it('should handle false match stopPropagation return', function() {
				var attributeMatchStub = sinon.stub().returns(false);
				var filter = new ClassNameFilter([], {
					stopPropagation: 'some value'
				});

				filter._attributesMatch = attributeMatchStub;
				expect(filter.stopPropagation()).to.be.undefined;
				expect(attributeMatchStub).to.be.called;
			});
		});
	});
});
