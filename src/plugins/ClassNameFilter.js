var ComboKeysContext = require('../Combokeys-Context');

/**
 * Create a filter that will enable/disable callbacks from certain class names
 * @implements {ContextPlugin}
 * @param {string[]} classNames A list of tag names
 * @param {object} options
 * @param {Context.StopPropagationReturn=} options.stopPropagation Value for stop propagation on match
 * @param {Context.PreventDefaultReturn=} options.preventDefault Value for prevent default on match
 * @param {Context.StopCallbackReturn=} options.stopCallback Value for stop callback on match
 * @param {boolean=} options.matchAll If true will match all class names, else match only one
 * @constructor
 */
var ClassNameFilter = function(classNames, options) {

	options = options || {};

	// clone the class names
	this._classNames = classNames.map(function(value) {
		return ' ' + value + ' ';
	});

	this._stopCallback = options.stopCallback;
	this._preventDefault = options.preventDefault;
	this._stopPropagation = options.stopPropagation;

	if (typeof options.matchAll === 'undefined') {
		this._matchAll = false;
	} else {
		this._matchAll = options.matchAll;
	}
};

ClassNameFilter.prototype.stopCallback = function(evt, element) {
	if (this._stopCallback && this._attributesMatch(element)) {
		return this._stopCallback;
	}
};

ClassNameFilter.prototype.preventDefault = function(evt, element) {
	if (this._preventDefault && this._attributesMatch(element)) {
		return this._preventDefault;
	}
};

ClassNameFilter.prototype.stopPropagation = function(evt, element) {
	if (this._stopPropagation && this._attributesMatch(element)) {
		return this._stopPropagation;
	}
};

ClassNameFilter.prototype._attributesMatch = function(element) {
	var i;

	if (!element.className) {
		return;
	}
	var className = ' ' + element.className + ' ';
	for (i = 0; i < this._classNames.length; i++) {
		if (className.indexOf(this._classNames[i]) > -1) {
			if (!this._matchAll) {
				return true;
			}
		} else {
			if (this._matchAll) {
				return false;
			}
		}
	}
	return this._matchAll;
};

module.exports = ClassNameFilter;
