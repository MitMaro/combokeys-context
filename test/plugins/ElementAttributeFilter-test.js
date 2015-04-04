// jscs:disable disallowAnonymousFunctions
/* eslint-disable no-unused-expressions */
'use strict';

var Filter = require('../../src/plugins/ElementAttributeFilter');

describe('ElementAttributeFilter', function() {
	var elementStub;

	beforeEach(function() {
		elementStub = {
			getAttribute: sinon.stub()
		};
	});

	describe('#_attributesMatch', function() {
		describe('with matchAll option', function() {
			var options;

			beforeEach(function() {
				options = {
					matchAll: true
				};
			});

			it('should handle no attributes', function() {
				var filter = new Filter({}, options);

				expect(filter._attributesMatch(elementStub)).to.be.true;
			});

			it('should handle all matching attributes, as single value', function() {
				var filter = new Filter({
					a: 'A',
					b: 'B',
					c: 'C'
				}, options);

				elementStub.getAttribute.onCall(0).returns('A');
				elementStub.getAttribute.onCall(1).returns('B');
				elementStub.getAttribute.onCall(2).returns('C');
				expect(filter._attributesMatch(elementStub)).to.be.true;
			});

			it('should handle all matching attributes, as array of values', function() {
				var filter = new Filter({
					a: ['A', 'AA', 'AAA'],
					b: ['B', 'BB', 'BBB'],
					c: ['C', 'CC', 'CCC']
				}, options);

				elementStub.getAttribute.onCall(0).returns('AA');
				elementStub.getAttribute.onCall(1).returns('BBB');
				elementStub.getAttribute.onCall(2).returns('C');
				expect(filter._attributesMatch(elementStub)).to.be.true;
			});

			it('should handle one unmatching attributes, as single value', function() {
				var filter = new Filter({
					a: 'A',
					b: 'B',
					c: 'C'
				}, options);

				elementStub.getAttribute.onCall(0).returns('A');
				elementStub.getAttribute.onCall(1).returns('D');
				elementStub.getAttribute.onCall(2).returns('C');
				expect(filter._attributesMatch(elementStub)).to.be.false;
			});

		});

		describe('without matchAll option', function() {
			it('should return undefined when there are no attributes, default options', function() {
				var filter = new Filter({});

				expect(filter._attributesMatch(elementStub)).to.be.false;
			});

			it('should handle no matching attributes, as single value', function() {
				var filter = new Filter({
					a: 'A',
					b: 'B',
					c: 'C'
				});

				elementStub.getAttribute.onCall(0).returns('D');
				elementStub.getAttribute.onCall(1).returns('D');
				elementStub.getAttribute.onCall(2).returns('D');
				expect(filter._attributesMatch(elementStub)).to.be.false;
			});

			it('should handle a matching attributes, as array of values', function() {
				var filter = new Filter({
					a: ['A', 'AA', 'AAA'],
					b: ['B', 'BB', 'BBB'],
					c: ['C', 'CC', 'CCC']
				});

				elementStub.getAttribute.onCall(0).returns('D');
				elementStub.getAttribute.onCall(1).returns('BB');
				elementStub.getAttribute.onCall(2).returns('D');
				expect(filter._attributesMatch(elementStub)).to.be.true;
			});

			it('should handle a matching attributes, as single value', function() {
				var filter = new Filter({
					a: 'A',
					b: 'B',
					c: 'C'
				});

				elementStub.getAttribute.onCall(0).returns('D');
				elementStub.getAttribute.onCall(1).returns('B');
				elementStub.getAttribute.onCall(2).returns('C');
				expect(filter._attributesMatch(elementStub)).to.be.true;
			});
		});
	});

	describe('ContextPlugin interface', function() {
		describe('#stopCallback', function() {
			it('should handle undefined stopCallback return', function() {
				var attributeMatchStub = sinon.stub();
				var filter = new Filter({});

				filter._attributesMatch = attributeMatchStub;
				expect(filter.stopCallback()).to.be.undefined;
				expect(attributeMatchStub).to.not.be.called;
			});

			it('should handle true match stopCallback return', function() {
				var attributeMatchStub = sinon.stub().returns(true);
				var filter = new Filter({}, {
					stopCallback: 'some value'
				});

				filter._attributesMatch = attributeMatchStub;
				expect(filter.stopCallback()).to.equal('some value');
				expect(attributeMatchStub).to.be.called;
			});

			it('should handle false match stopCallback return', function() {
				var attributeMatchStub = sinon.stub().returns(false);
				var filter = new Filter({}, {
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
				var filter = new Filter({});

				filter._attributesMatch = attributeMatchStub;
				expect(filter.preventDefault()).to.be.undefined;
				expect(attributeMatchStub).to.not.be.called;
			});

			it('should handle true match preventDefault return', function() {
				var attributeMatchStub = sinon.stub().returns(true);
				var filter = new Filter({}, {
					preventDefault: 'some value'
				});

				filter._attributesMatch = attributeMatchStub;
				expect(filter.preventDefault()).to.equal('some value');
				expect(attributeMatchStub).to.be.called;
			});

			it('should handle false match preventDefault return', function() {
				var attributeMatchStub = sinon.stub().returns(false);
				var filter = new Filter({}, {
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
				var filter = new Filter({});

				filter._attributesMatch = attributeMatchStub;
				expect(filter.stopPropagation()).to.be.undefined;
				expect(attributeMatchStub).to.not.be.called;
			});

			it('should handle true match stopPropagation return', function() {
				var attributeMatchStub = sinon.stub().returns(true);
				var filter = new Filter({}, {
					stopPropagation: 'some value'
				});

				filter._attributesMatch = attributeMatchStub;
				expect(filter.stopPropagation()).to.equal('some value');
				expect(attributeMatchStub).to.be.called;
			});

			it('should handle false match stopPropagation return', function() {
				var attributeMatchStub = sinon.stub().returns(false);
				var filter = new Filter({}, {
					stopPropagation: 'some value'
				});

				filter._attributesMatch = attributeMatchStub;
				expect(filter.stopPropagation()).to.be.undefined;
				expect(attributeMatchStub).to.be.called;
			});
		});
	});
});
