'use strict';

/**
 * Plugin that will return the values provided. Great for setting defaults.
 * @implements {ContextPlugin}
 * @param {Context.PreventDefaultReturn=} preventDefault Value to return for the {@link Plugin#preventDefault} function
 * @param {Context.StopPropagationReturn=} stopPropagation Value to return for the {@link Plugin#stopPropagation} function
 * @param {Context.StopCallbackReturn=} stopCallback Value to return for the {@link Plugin#stopCallback} function
 * @constructor
 */
function StaticPlugin(preventDefault, stopPropagation, stopCallback) {
	this._preventDefault = preventDefault;
	this._stopPropagation = stopPropagation;
	this._stopCallback = stopCallback;
}

StaticPlugin.prototype.stopCallback = function stopCallback() {
	return this._stopCallback;
};

StaticPlugin.prototype.stopPropagation = function stopPropagation() {
	return this._stopPropagation;
};

StaticPlugin.prototype.preventDefault = function preventDefault() {
	return this._preventDefault;
};

module.exports = StaticPlugin;
