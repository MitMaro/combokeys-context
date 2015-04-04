// jscs:disable disallowAnonymousFunctions, requirePaddingNewLinesInObjects
/* eslint-disable no-unused-expressions */
'use strict';

var rewire = require('rewire');
var ComboKeysContext = rewire('../src/Combokeys-Context');

describe('Combo Keys context', function() {
	var comboKeysStub;
	var targetStub;
	var preventDefaultStub;
	var stopPropagationStub;

	beforeEach(function() {
		comboKeysStub = {
			bind: sinon.stub(),
			unbind: sinon.stub(),
			reset: sinon.stub()
		};

		targetStub = sinon.stub();
		preventDefaultStub = sinon.stub();
		stopPropagationStub = sinon.stub();

		ComboKeysContext.__set__('eventTarget', targetStub);
		ComboKeysContext.__set__('preventDefault', preventDefaultStub);
		ComboKeysContext.__set__('stopPropagation', stopPropagationStub);
	});

	it('requires Combokeys instance in constructor', function() {
		expect(function() {
			/*eslint-disable no-new */
			new ComboKeysContext();
			/*eslint-enable no-new */
		}).to.Throw(Error);
	});

	it('can delete a binding', function() {
		var context = new ComboKeysContext(comboKeysStub);

		context._bindings = {
			a: {
				global: 'not a function',
				contexts: {}
			}
		};
		context._deleteBinding('a');
		expect(context._bindings).to.be.empty;
	});

	it('can reset', function() {
		var context = new ComboKeysContext(comboKeysStub);

		context._bindings = 'bindings';
		context._context = 'context';
		context.reset();

		expect(comboKeysStub.reset).to.be.called;
		expect(context._bindings).to.be.empty;
		expect(context._context).to.be.Null;
		expect(context._plugins).to.eql({
			global: [],
			contexts: {}
		});
		expect(context._activePlugins).to.eql([]);
	});

	describe('registerPlugin', function() {
		it('can register global plugins', function() {
			var context = new ComboKeysContext(comboKeysStub);
			var plugin1 = {};
			var plugin2 = {};

			context.registerPlugin(plugin1);
			context.registerPlugin(plugin2);

			expect(context._plugins.global).to.be.eql([plugin1, plugin2]);
		});
		it('can register context plugins', function() {
			var context = new ComboKeysContext(comboKeysStub);
			var plugin1 = {};
			var plugin2 = {};
			var plugin3 = {};

			context.registerPlugin(plugin1, 'foo');
			context.registerPlugin(plugin2, 'foo');
			context.registerPlugin(plugin3, 'bar');

			expect(context._plugins.contexts.foo).to.be.eql([plugin1, plugin2]);
			expect(context._plugins.contexts.bar).to.be.eql([plugin3]);
		});
	});

	describe('._register', function() {
		var context;

		beforeEach(function() {
			context = new ComboKeysContext(comboKeysStub);
		});

		it('registers new keys', function() {
			context._register('a', null, 'a function');
			expect(context._bindings).to.have.key('a');
			expect(context._bindings.a.handler).to.be.a('function');
			expect(context._bindings.a.global).to.eql('a function');
			expect(context._bindings.a.contexts).to.eql({});
			expect(comboKeysStub.bind).to.be.calledWith('a', context._bindings.a.handler);
		});

		it('registers existing keys', function() {
			context._bindings.a = {
				handler: 'a handler',
				global: null,
				contexts: {}
			};
			context._register('a', null, 'a function');
			expect(context._bindings).to.eql({
				a: {
					handler: 'a handler',
					global: 'a function',
					contexts: {}
				}
			});
			expect(comboKeysStub.bind).to.not.be.called;
		});

		it('registers keys with context', function() {
			context._bindings.a = {
				handler: 'a handler',
				global: null,
				contexts: {}
			};
			context._register('a', 'A', 'a context function');
			expect(context._bindings).to.eql({
				a: {
					handler: 'a handler',
					global: null,
					contexts: {
						A: 'a context function'
					}
				}
			});
			expect(comboKeysStub.bind).to.not.be.called;
		});
	});

	describe('.bind', function() {
		var context;

		beforeEach(function() {
			context = new ComboKeysContext(comboKeysStub);
		});
		it('will bind key without context', function() {
			var callback = sinon.stub();

			context._register = sinon.stub();
			context.bind('alt+a', callback, 'keyup');

			expect(context._register).to.be.calledWith(
				'alt+a', null, callback, 'keyup'
			);
		});

		it('will bind keys without context', function() {
			var callback = sinon.stub();

			context._register = sinon.stub();
			context.bind(['alt+a', 'alt+b'], callback, 'keyup');

			expect(context._register).to.be.calledWith(
				'alt+a', null, callback, 'keyup'
			);
			expect(context._register).to.be.calledWith(
				'alt+b', null, callback, 'keyup'
			);
		});

		it('will bind key with context', function() {
			var callback = sinon.stub();

			context._register = sinon.stub();
			context.bind('alt+a', 'context', callback, 'keyup');

			expect(context._register).to.be.calledWith(
				'alt+a', 'context', callback, 'keyup'
			);
		});
	});

	describe('.unbind', function() {
		var context;

		beforeEach(function() {
			context = new ComboKeysContext(comboKeysStub);
		});

		it('will ignore unbinded keys', function() {
			context._deleteBinding = sinon.stub();
			context.unbind('a');
			// also now error should occur
			expect(context._deleteBinding).to.not.be.called;
		});

		it('will unbind a key in global scope with no contexts registered', function() {
			context._bindings = {
				a: {
					global: 'not a function',
					contexts: {}
				}
			};

			context._deleteBinding = sinon.stub();

			context.unbind('a');
			expect(context._bindings).to.eql({
				a: {
					global: null,
					contexts: {}
				}
			});
			expect(context._deleteBinding).to.be.calledWith('a');
		});

		it('will unbind a key in global scope with contexts registered', function() {
			context._bindings = {
				a: {
					global: 'a function',
					contexts: {
						A: 'a function'
					}
				}
			};
			context._deleteBinding = sinon.stub();

			context.unbind('a');
			expect(context._bindings).to.eql({
				a: {
					global: null,
					contexts: {
						A: 'a function'
					}
				}
			});
			expect(context._deleteBinding).to.not.be.called;
		});

		it('will unbind keys in global scope', function() {
			context._bindings = {
				a: {
					global: 'a function',
					contexts: {}
				},
				b: {
					global: 'a function',
					contexts: {}
				}
			};
			context._deleteBinding = sinon.stub();

			context.unbind(['a', 'b']);
			expect(context._bindings).to.eql({
				a: {
					global: null,
					contexts: {}
				},
				b: {
					global: null,
					contexts: {}
				}
			});
			expect(context._deleteBinding).to.be.calledWith('a');
			expect(context._deleteBinding).to.be.calledWith('b');
		});

		it('will unbind a key in context scope with no global registered', function() {
			context._bindings = {
				a: {
					global: null,
					contexts: {
						A: 'a function'
					}
				}
			};

			context._deleteBinding = sinon.stub();

			context.unbind('a', 'A');
			expect(context._bindings).to.eql({
				a: {
					global: null,
					contexts: {}
				}
			});
			expect(context._deleteBinding).to.be.calledWith('a');
		});

		it('will unbind a key in context scope with global registered', function() {
			context._bindings = {
				a: {
					global: 'a function',
					contexts: {
						A: 'a function'
					}
				}
			};
			context._deleteBinding = sinon.stub();

			context.unbind('a', 'A');
			expect(context._bindings).to.eql({
				a: {
					global: 'a function',
					contexts: {}
				}
			});
			expect(context._deleteBinding).to.not.be.called;
		});

		it('will unbind a key in context scope with global and other context registered', function() {
			context._bindings = {
				a: {
					global: 'a function',
					contexts: {
						A: 'a function',
						B: 'a function'
					}
				}
			};
			context._deleteBinding = sinon.stub();

			context.unbind('a', 'A');
			expect(context._bindings).to.eql({
				a: {
					global: 'a function',
					contexts: {
						B: 'a function'
					}
				}
			});
			expect(context._deleteBinding).to.not.be.called;
		});

		it('will unbind a key in context scope with other context registered', function() {
			context._bindings = {
				a: {
					global: null,
					contexts: {
						A: 'a function',
						B: 'a function'
					}
				}
			};
			context._deleteBinding = sinon.stub();

			context.unbind('a', 'A');
			expect(context._bindings).to.eql({
				a: {
					global: null,
					contexts: {
						B: 'a function'
					}
				}
			});
			expect(context._deleteBinding).to.not.be.called;
		});

		it('will unbind keys in context scope', function() {
			context._bindings = {
				a: {
					global: null,
					contexts: {
						A: 'a function'
					}
				},
				b: {
					global: null,
					contexts: {
						A: 'a function'
					}
				}
			};
			context._deleteBinding = sinon.stub();

			context.unbind(['a', 'b'], 'A');
			expect(context._bindings).to.eql({
				a: {
					global: null,
					contexts: {}
				},
				b: {
					global: null,
					contexts: {}
				}
			});
			expect(context._deleteBinding).to.be.calledWith('a');
			expect(context._deleteBinding).to.be.calledWith('b');
		});
	});

	describe('.unbindAll', function() {
		var context;

		beforeEach(function() {
			context = new ComboKeysContext(comboKeysStub);
		});

		it('will unbind single key', function() {
			context._bindings = {
				a: 'binding'
			};
			context._deleteBinding = sinon.stub();
			context.unbindAll('a');
			expect(context._deleteBinding).to.be.calledWith('a');
		});

		it('will unbind keys', function() {
			context._bindings = {
				a: 'binding',
				b: 'binding'
			};
			context._deleteBinding = sinon.stub();
			context.unbindAll(['a', 'b']);
			expect(context._deleteBinding).to.be.calledWith('a');
			expect(context._deleteBinding).to.be.calledWith('b');
		});

		it('will handle undefined key', function() {
			context._deleteBinding = sinon.stub();
			context.unbindAll('c');
			expect(context._deleteBinding).to.not.be.called;
		});
	});

	describe('context switching', function() {
		it('will error on no context passed to switchContext', function() {
			var context = new ComboKeysContext(comboKeysStub);

			expect(context.switchContext).to.Throw(Error);
		});

		it('can switch context', function() {
			var context = new ComboKeysContext(comboKeysStub);

			context.switchContext('ABC');
			expect(context._context).to.equal('ABC');
			context.switchContext('DEF');
			expect(context._context).to.equal('DEF');
		});

		it('can clear context', function() {
			var context = new ComboKeysContext(comboKeysStub);

			context._context = 'A Context';
			context.clearContext();
			expect(context._context).to.be.Null;
		});
	});

	describe('handle key events', function() {
		var context;

		beforeEach(function() {
			context = new ComboKeysContext(comboKeysStub);
		});

		it('calls function in global scope', function() {
			var globalCallback = sinon.stub();
			var evt = 'my event';
			var key = 'a';

			context._register(key, null, globalCallback);

			context._bindings[key].handler(evt, key);

			expect(globalCallback).to.be.calledWith(evt, key);

		});

		it('calls function in context scope, before global scope', function() {
			var globalCallback = sinon.stub();
			var contextCallback = sinon.stub();
			var evt = 'my event';
			var key = 'a';

			context._register(key, null, globalCallback);
			context._register(key, 'A', contextCallback);
			context._context = 'A';
			context._bindings[key].handler(evt, key);
			expect(contextCallback).to.be.calledWith(evt, key);
		});

		it('calls function in global scope without global scope registered', function() {
			var contextCallback = sinon.stub();
			var evt = 'my event';
			var key = 'a';

			context._register(key, 'A', contextCallback);
			context._bindings[key].handler(evt, key);
			expect(contextCallback).to.not.be.called;
		});

		it('calls function in scope without scope registered', function() {
			var globalCallback = sinon.stub();
			var evt = 'my event';
			var key = 'a';

			context._register(key, null, globalCallback);
			context._context = 'A';
			context._bindings[key].handler(evt, key);
			expect(globalCallback).to.be.calledWith(evt, key);
		});

		describe('preventDefault plugin support', function() {
			var globalStub;
			var eventStub;
			var key = 'a';

			beforeEach(function() {
				globalStub = sinon.stub();
				eventStub = {};
				context._register(key, null, globalStub);
			});

			it('without preventDefault function defined', function() {
				context.registerPlugin({});
				context._bindings[key].handler(eventStub, key);
				expect(preventDefaultStub).to.not.be.called;
			});

			it('without preventDefault that returns undefined', function() {
				context.registerPlugin({preventDefault: sinon.stub().returns('yes')});
				context.registerPlugin({preventDefault: sinon.stub()});
				context._bindings[key].handler(eventStub, key);
				expect(preventDefaultStub).to.be.called;
			});

			it('without preventDefault that returns yes', function() {
				context.registerPlugin({preventDefault: sinon.stub().returns('yes')});
				context._bindings[key].handler(eventStub, key);
				expect(preventDefaultStub).to.be.called;
			});

			it('without preventDefault that returns no', function() {
				context.registerPlugin({preventDefault: sinon.stub().returns('no')});
				context._bindings[key].handler(eventStub, key);
				expect(preventDefaultStub).to.not.be.called;
			});

			it('without preventDefault that returns forced yes', function() {
				context.registerPlugin({preventDefault: sinon.stub().returns('yes_force')});
				context.registerPlugin({preventDefault: sinon.stub()});
				context._bindings[key].handler(eventStub, key);
				expect(preventDefaultStub).to.be.called;
				expect(context._plugins.global[1].preventDefault).to.not.be.called;
			});

			it('without preventDefault that returns forced no', function() {
				context.registerPlugin({preventDefault: sinon.stub().returns('no_force')});
				context.registerPlugin({preventDefault: sinon.stub()});
				context._bindings[key].handler(eventStub, key);
				expect(preventDefaultStub).to.not.be.called;
				expect(context._plugins.global[1].preventDefault).to.not.be.called;
			});
		});

		describe('stopPropagation plugin support', function() {
			var globalStub;
			var eventStub;
			var key = 'a';

			beforeEach(function() {
				globalStub = sinon.stub();
				eventStub = {};
				context._register(key, null, globalStub);
			});

			it('without stopPropagation function defined', function() {
				context.registerPlugin({});
				context._bindings[key].handler(eventStub, key);
				expect(stopPropagationStub).to.not.be.called;
			});

			it('without stopPropagation that returns undefined', function() {
				context.registerPlugin({stopPropagation: sinon.stub().returns('yes')});
				context.registerPlugin({stopPropagation: sinon.stub()});
				context._bindings[key].handler(eventStub, key);
				expect(stopPropagationStub).to.be.called;
			});

			it('without stopPropagation that returns yes', function() {
				context.registerPlugin({stopPropagation: sinon.stub().returns('yes')});
				context._bindings[key].handler(eventStub, key);
				expect(stopPropagationStub).to.be.called;
			});

			it('without stopPropagation that returns no', function() {
				context.registerPlugin({stopPropagation: sinon.stub().returns('no')});
				context._bindings[key].handler(eventStub, key);
				expect(stopPropagationStub).to.not.be.called;
			});

			it('without stopPropagation that returns forced yes', function() {
				context.registerPlugin({stopPropagation: sinon.stub().returns('yes_force')});
				context.registerPlugin({stopPropagation: sinon.stub()});
				context._bindings[key].handler(eventStub, key);
				expect(stopPropagationStub).to.be.called;
				expect(context._plugins.global[1].stopPropagation).to.not.be.called;
			});

			it('without stopPropagation that returns forced no', function() {
				context.registerPlugin({stopPropagation: sinon.stub().returns('no_force')});
				context.registerPlugin({stopPropagation: sinon.stub()});
				context._bindings[key].handler(eventStub, key);
				expect(stopPropagationStub).to.not.be.called;
				expect(context._plugins.global[1].stopPropagation).to.not.be.called;
			});
		});
	});

	describe('._stopCallback', function() {
		var context;

		beforeEach(function() {
			context = new ComboKeysContext(comboKeysStub);
		});

		it('handles no plugins registered', function() {
			expect(context._stopCallback()).to.be.False;
		});

		it('handles plugin without stopCallback', function() {
			context.registerPlugin({});
			expect(context._stopCallback()).to.be.False;
		});

		it('handles plugin with stopCallback that returns undefined', function() {
			context.registerPlugin({stopCallback: sinon.stub().returns('yes')});
			context.registerPlugin({stopCallback: sinon.stub()});
			expect(context._stopCallback()).to.be.True;
		});

		it('handles plugin with stopCallback that returns yes', function() {
			context.registerPlugin({stopCallback: sinon.stub().returns('yes')});
			expect(context._stopCallback()).to.be.True;
		});

		it('handles plugin with stopCallback that returns no', function() {
			context.registerPlugin({stopCallback: sinon.stub().returns('no')});
			expect(context._stopCallback()).to.be.False;
		});

		it('handles plugin with stopCallback that returns force yes', function() {
			context.registerPlugin({stopCallback: sinon.stub().returns('yes_force')});
			context.registerPlugin({stopCallback: sinon.stub().returns('no')});
			expect(context._stopCallback()).to.be.True;
			expect(context._plugins.global[1].stopCallback).to.not.be.called;
		});

		it('handles plugin with stopCallback that returns force no', function() {
			context.registerPlugin({stopCallback: sinon.stub().returns('no_force')});
			context.registerPlugin({stopCallback: sinon.stub().returns('no')});
			expect(context._stopCallback()).to.be.False;
			expect(context._plugins.global[1].stopCallback).to.not.be.called;
		});
	});

	describe('#_combinePlugins', function() {
		var context;
		
		beforeEach(function() {
			context = new ComboKeysContext(comboKeysStub);
		});

		it('should combine with only global plugins', function() {
			context._plugins = {
				global: [
					{}, {}
				],
				contexts: {}
			};
			context._combinePlugins();
			expect(context._activePlugins).to.eql([
				context._plugins.global[0],
				context._plugins.global[1]
			]);
		});

		it('should combine with only context plugins', function() {
			context._plugins = {
				global: [],
				contexts: {
					foo: [{}, {}]
				}
			};
			context._context = 'foo';
			context._combinePlugins();
			expect(context._activePlugins).to.eql([
				context._plugins.contexts.foo[0],
				context._plugins.contexts.foo[1]
			]);
		});

		it('should combine with both context and global plugins', function() {
			context._plugins = {
				global: [{a: 'A'}, {b: 'B'}],
				contexts: {
					foo: [{c: 'C'}, {d: 'D'}]
				}
			};
			context._context = 'foo';
			context._combinePlugins();
			expect(context._activePlugins).to.eql([
				context._plugins.global[0],
				context._plugins.contexts.foo[0],
				context._plugins.global[1],
				context._plugins.contexts.foo[1]
			]);
		});
	});
});
