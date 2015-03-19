
var ComboKeysContext = require('../src/Combokeys-Context');

describe('Combo Keys context', function() {

	var comboKeysStub;

	beforeEach(function() {
		comboKeysStub = {
			bind: sinon.stub(),
			unbind: sinon.stub(),
			reset: sinon.stub()
		};
	});

	it('requires Combokeys instance in constructor', function() {
		expect(function() {
			new ComboKeysContext()
		}).to.throw(Error)
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
		expect(context._context).to.be.null;
	});

	describe('#_register', function() {

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
		it('will bind key without context', function () {
			var callback = sinon.stub();
			context._register = sinon.stub();
			context.bind('alt+a', callback, 'keyup');

			expect(context._register).to.be.calledWith(
				'alt+a', null, callback, 'keyup'
			);

		});

		it('will bind keys without context', function () {
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


		it('will bind key with context', function () {
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
			expect(context.switchContext).to.throw(Error);
		});

		it('can switch context', function() {
			var context = new ComboKeysContext(comboKeysStub);
			context.switchContext('ABC');
			expect(context._context).to.equal('ABC');
			context.switchContext('DEF');
			expect(context._context).to.equal('DEF');
		});

		it ('can clear context', function() {
			var context = new ComboKeysContext(comboKeysStub);
			context._context = 'A Context';
			context.clearContext();
			expect(context._context).to.be.null;
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
	});
});
