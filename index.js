/**
 * Combokeys Context Module.
 * @module combokeys-context
 */

/**
 * Access to the Context constructor
 * @example
 * var ComboKeysContext = require('combokeys-context');
 * var myComboKeysContext = new ComboKeysContext();
 * @type {Context}
 */
var ComboKeysContext = require('./src/Combokeys-Context');

/**
 * Access to the plugins
 * @example
 * var StaticPlugin = require('combokeys-context').plugins.StaticPlugin;
 * @name plugins
 * @member {PluginList}
 */
ComboKeysContext.plugins = {
	StaticPlugin: require('./src/plugins/StaticFilter'),
	TagCallbackFilter: require('./src/plugins/TagCallbackFilter')
};

module.exports = ComboKeysContext;

/**
 * @typedef {Object} PluginList
 * @property {StaticPlugin} StaticPlugin
 * @property {TagCallbackFilter} TagCallbackFilter
 */
