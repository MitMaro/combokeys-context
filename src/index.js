
var isArray = require('./util/isArray');

function wrapHandler(key, evt, combo) {
	if (this._context) {
		this._bindings[key].contexts[this._context].call(this, evt, combo);
	} else {
		this._bindings[key].global.call(this, evt, combo);
	}
}

var Context = function(comboKeys) {
	this._bindings = {};
	this._context = null;
	this._comboKeys = comboKeys;

};

Context.prototype.bind = function(key, context, callback, action) {
	var i;
	var keys = isArray(key) ? key : [key];

	// if context is a function we assume it's the callback and shift params
	if (typeof context === 'function') {
		action = callback;
		callback = context;
		context = null;
	}

	for (i = 0; i < keys.length; ++i) {
		this._register(keys[i], context, callback, action);
	}
};

Context.prototype.unbind = function(key, context) {
	var i;
	var binding;
	var keys = isArray(key) ? key : [key];

	for (i = 0; i < keys.length; ++i) {
		// skip bindings that don't exist
		if (!(keys[i] in this._bindings)) {
			continue;
		}
		binding = this._bindings[keys[i]];

		if (context) {
			delete binding.contexts[context];
			if (binding.global === null && binding.contexts) {}
		} else {
			this._comboKeys.unbind(keys[i]);
			delete binding;
		}
	}
};

Context.prototype.reset = function() {
	this._comboKeys.reset();
	this._bindings = {};
	this._context = null;
};

Context.prototype._register = function(key, context, callback, action) {
	if (!(key in this._bindings)) {
		this._bindings[key] = {
			handler: wrapHandler.bind(this._comboKeys, key),
			global: null,
			contexts: {}
		};
		this._comboKeys.bind(key, this._bindings[key].handler, action);
	}

	if (context) {
		this._bindings[key].contexts[context] = callback;
	} else {
		this._bindings[key].global = callback;
	}

};

Context.prototype.switchContext = function(context) {
	this._context = context;
};

module.exports = Context;
