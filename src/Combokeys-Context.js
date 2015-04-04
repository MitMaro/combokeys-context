'use strict';

var _ = {
	isArray: require('lodash/lang/isArray')
};

var eventTarget = require('cross-browser/Event/target');
var preventDefault = require('cross-browser/Event/preventDefault');
var stopPropagation = require('cross-browser/Event/stopPropagation');

var yesForce = 'yes_force';
var yes = 'yes';
var no = 'no';
var noForce = 'no_force';

function wrapHandler(key, evt, combo) {
	var i;
	var target = eventTarget(evt);
	var eventDefault = no;
	var eventPropagation = no;
	var result;

	if (this._context && this._bindings[key].contexts[this._context]) {
		this._bindings[key].contexts[this._context].call(this._comboKeys, evt, combo);
	}
	else if (this._bindings[key].global) {
		this._bindings[key].global.call(this._comboKeys, evt, combo);
	}

	for (i = 0; i < this._activePlugins.length; i++) {
		if (
			eventDefault !== yesForce && eventDefault !== noForce &&
			typeof this._activePlugins[i].preventDefault === 'function'
		) {
			result = this._activePlugins[i].preventDefault(evt, target, combo, this._context);
			if (typeof result !== 'undefined') {
				eventDefault = result;
			}
		}
		if (
			eventPropagation !== yesForce && eventPropagation !== noForce &&
			typeof this._activePlugins[i].stopPropagation === 'function'
		) {
			result = this._activePlugins[i].stopPropagation(evt, target, combo, this._context);
			if (typeof result !== 'undefined') {
				eventPropagation = result;
			}
		}
	}

	if (eventDefault === yes || eventDefault === yesForce) {
		preventDefault(evt);
	}

	if (eventPropagation === yes || eventPropagation === yesForce) {
		stopPropagation(evt);
	}
}

/**
 * Constructs a new instance of Combokeys Context
 * @param comboKeys An instance of Combokeys
 * @constructor
 */
function Context(comboKeys) {
	if (typeof comboKeys === 'undefined') {
		throw new Error('CombokeysContext: Constructor requires an instance of Combokeys');
	}
	this._bindings = {};
	this._context = null;
	this._comboKeys = comboKeys;
	this._plugins = {
		global: [],
		contexts: {}
	};
	this._activePlugins = [];

	this._comboKeys.stopCallback = this._stopCallback.bind(this);
}

/**
 * Force preventDefault to be called
 * @constant
 */
Context.PREVENT_DEFAULT_FORCE = yesForce;
/**
 * preventDefault may be called
 * @constant
 */
Context.PREVENT_DEFAULT = yes;
/**
 * preventDefault may not be called
 * @constant
 */
Context.ALLOW_DEFAULT = no;
/**
 * Force preventDefault to be called
 * @constant
 */
Context.ALLOW_DEFAULT_FORCE = noForce;
/**
 * Force stopPropagation to be called
 * @constant
 */
Context.STOP_PROPAGATION_FORCE = yesForce;
/**
 * stopPropagation may be called
 * @constant
 */
Context.STOP_PROPAGATION = yes;
/**
 * stopPropagation may not be called
 * @constant
 */
Context.ALLOW_PROPAGATION = no;
/**
 * Force stopPropagation not to be called
 * @constant
 */
Context.ALLOW_PROPAGATION_FORCE = noForce;
/**
 * Force callback to not be called
 * @constant
 */
Context.STOP_CALLBACK_FORCE = yesForce;
/**
 * Callback may not be called
 * @constant
 */
Context.STOP_CALLBACK = yes;
/**
 * Callback may be called
 * @constant
 */
Context.ALLOW_CALLBACK = no;
/**
 * Force callback to be called
 * @constant
 */
Context.ALLOW_CALLBACK_FORCE = noForce;

/**
 * Bind keys to an action with an optional context
 * @param key The key combination, see [Mousetrap.bind]{@link http://craig.is/killing/mice#api.bind}
 * @param [context] A context for the binding, if not provided it is set to the global scope
 * @param callback The callback to call when key is pressed in context
 * @param action The event action, see [Mousetrap.bind single]{@link http://craig.is/killing/mice#api.bind.single}
 */
Context.prototype.bind = function bind(key, context, callback, action) {
	var i;
	var keys = _.isArray(key)? key: [key];

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
Context.prototype.unbind = function unbind(key, context) {
	var i;
	var binding;
	var keys = _.isArray(key)? key: [key];

	for (i = 0; i < keys.length; ++i) {
		// skip bindings that don't exist
		if ('undefined' === typeof this._bindings[keys[i]]) {
			continue;
		}

		binding = this._bindings[keys[i]];

		if (context) {
			delete binding.contexts[context];
		}
		else {
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
Context.prototype.unbindAll = function unbindAll(key) {

	var i;
	var keys = _.isArray(key)? key: [key];

	for (i = 0; i < keys.length; ++i) {

		// skip bindings that don't exist
		if ('undefined' === typeof this._bindings[keys[i]]) {
			continue;
		}

		this._deleteBinding(keys[i]);
	}
};

/**
 * Reset this instance back to the default state, removing all bound keys
 */
Context.prototype.reset = function reset() {
	this._comboKeys.reset();
	this._bindings = {};
	this._context = null;
	this._plugins.global = [];
	this._plugins.contexts = {};
	this._activePlugins = [];
};

/**
 * Switch the active context
 * @param context The active context
 */
Context.prototype.switchContext = function switchContext(context) {
	if (typeof context === 'undefined') {
		throw new Error('CombokeysContext: switchContext expects a context to be passed');
	}
	this._context = context;
	this._combinePlugins();
};

/**
 * Clear the content, setting to global only
 */
Context.prototype.clearContext = function clearContext() {
	this._context = null;
	this._combinePlugins();
};

/**
 * Register a plugin that follows the {@link Plugin} interface
 *
 * @param {ContextPlugin} plugin A plugin to be registered
 */
Context.prototype.registerPlugin = function registerPlugin(plugin, context) {
	if ('undefined' === typeof context) {
		this._plugins.global.push(plugin);
	}
	else {
		if ('undefined' === typeof this._plugins.contexts[context]) {
			this._plugins.contexts[context] = [];
		}
		this._plugins.contexts[context].push(plugin);
	}
	this._combinePlugins();
};

Context.prototype._deleteBinding = function _deleteBinding(key) {
	this._comboKeys.unbind(key);
	delete this._bindings[key];
};

Context.prototype._register = function _register(key, context, callback, action) {
	if ('undefined' === typeof this._bindings[key]) {
		this._bindings[key] = {
			handler: wrapHandler.bind(this, key),
			global: null,
			contexts: {}
		};
		this._comboKeys.bind(key, this._bindings[key].handler, action);
	}

	if (context) {
		this._bindings[key].contexts[context] = callback;
	}
	else {
		this._bindings[key].global = callback;
	}
};

Context.prototype._stopCallback = function _stopCallback(evt, element, combo) {
	var i;
	var result;
	var stopCallback = no;

	for (i = 0; i < this._activePlugins.length; i++) {
		if (typeof this._activePlugins[i].stopCallback === 'function') {
			result = this._activePlugins[i].stopCallback(evt, eventTarget(evt), combo, this._context);
			// if force yes or no return now
			if (result === yesForce) {
				return true;
			}
			else if (result === noForce) {
				return false;
			}
			if (typeof result !== 'undefined') {
				stopCallback = result;
			}
		}
	}

	return stopCallback === yes;
};

Context.prototype._combinePlugins = function _combinePlugins() {
	var i = 0;
	var length;
	var globalPluginLength = this._plugins.global.length;
	var contextPluginLength = 0;

	if (this._context && typeof this._plugins.contexts[this._context] !== 'undefined') {
		contextPluginLength = this._plugins.contexts[this._context].length;
	}
	length = Math.max(globalPluginLength, contextPluginLength);

	this._activePlugins = [];
	while (i < length) {
		if (i < globalPluginLength) {
			this._activePlugins.push(this._plugins.global[i]);
		}
		if (i < contextPluginLength) {
			this._activePlugins.push(this._plugins.contexts[this._context][i]);
		}
		i++;
	}
};

module.exports = Context;
