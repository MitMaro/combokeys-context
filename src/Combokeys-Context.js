var isArray = require('./util/isArray');

function wrapHandler(key, evt, combo) {
	if (this._context) {
		this._bindings[key].contexts[this._context].call(this._comboKeys, evt, combo);
	} else {
		this._bindings[key].global.call(this._comboKeys, evt, combo);
	}
}

/**
 * Constructs a new instance of Combokeys Context
 * @param comboKeys An instance of Combokeys
 * @constructor
 */
var Context = function(comboKeys) {
	if (typeof comboKeys === 'undefined') {
		throw new Error('CombokeysContext: Constructor requires an instance of Combokeys');
	}
	this._bindings = {};
	this._context = null;
	this._comboKeys = comboKeys;
};

/**
 * Bind keys to an action with an optional context
 * @param key The key combination, see [Mousetrap.bind]{@link http://craig.is/killing/mice#api.bind}
 * @param [context] A context for the binding, if not provided it is set to the global scope
 * @param callback The callback to call when key is pressed in context
 * @param action The event action, see [Mousetrap.bind single]{@link http://craig.is/killing/mice#api.bind.single}
 */
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

/**
 * Unbind a key with an optional context
 * @param key The key combination, see [Mousetrap.bind]{@link http://craig.is/killing/mice#api.bind}
 * @param [context] A context for the unbinding, if not provided it will unbind the global scope
 */
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
		} else {
			binding.global = null;
		}

		// completely remove the binding if nothing is listening
		if (binding.global === null && Object.keys(binding.contexts).length === 0) {
			this._deleteBinding(keys[i]);
		}
	}
};

/**
 * Unbind all actions for a key, both global and contextual
 * @param key The key combination, see [Mousetrap.bind]{@link http://craig.is/killing/mice#api.bind}
 */
Context.prototype.unbindAll = function(key) {

	var i;
	var keys = isArray(key) ? key : [key];

	for (i = 0; i < keys.length; ++i) {

		// skip bindings that don't exist
		if (!(keys[i] in this._bindings)) {
			continue;
		}

		this._deleteBinding(keys[i]);
	}
};

/**
 * Reset this instance back to the default state, removing all bound keys
 */
Context.prototype.reset = function() {
	this._comboKeys.reset();
	this._bindings = {};
	this._context = null;
};

/**
 * Switch the active context
 * @param context The active context
 */
Context.prototype.switchContext = function(context) {
	if (typeof context === 'undefined') {
		throw new Error('CombokeysContext: switchContext expects a context to be passed');
	}
	this._context = context;
};

/**
 * Clear the content, setting to global only
 */
Context.prototype.clearContext = function() {
	this._context = null;
};

Context.prototype._deleteBinding = function(key) {
	this._comboKeys.unbind(key);
	delete this._bindings[key];
};

Context.prototype._register = function(key, context, callback, action) {
	if (!(key in this._bindings)) {
		this._bindings[key] = {
			handler: wrapHandler.bind(this, key),
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

module.exports = Context;
