var _ = {
	isArray: require('lodash/lang/isArray')
};

/**
 * Create a filter that will enable/disable callbacks from certain class names
 * @implements {ContextPlugin}
 * @param {Object.<string, (string|string[])>} attributes An object of key value pairs where the
 * keys are the attribute name and the value is an attribute value as a string, or an array of
 * attribute value strings.
 * @param {object} options
 * @param {Context.StopPropagationReturn=} options.stopPropagation Value for stop propagation on match
 * @param {Context.PreventDefaultReturn=} options.preventDefault Value for prevent default on match
 * @param {Context.StopCallbackReturn=} options.stopCallback Value for stop callback on match
 * @param {boolean=} options.matchAll If true will match all attribute, else match one
 * @constructor
 */
var ElementAttributeFilter = function(attributes, options) {
	var key;

	options = options || {};

	this._attributes = {};

	for (key in attributes) {
		this._attributes[key] = _.isArray(attributes[key]) ? attributes[key] : [attributes[key]];
	}

	this._stopCallback = options.stopCallback;
	this._preventDefault = options.preventDefault;
	this._stopPropagation = options.stopPropagation;

	if (typeof options.matchAll === 'undefined') {
		this._matchAll = false;
	} else {
		this._matchAll = options.matchAll;
	}
};

ElementAttributeFilter.prototype.stopCallback = function(evt, element) {
	if (this._stopCallback && this._attributesMatch(element)) {
		return this._stopCallback;
	}
};

ElementAttributeFilter.prototype.preventDefault = function(evt, element) {
	if (this._preventDefault && this._attributesMatch(element)) {
		return this._preventDefault;
	}
};

ElementAttributeFilter.prototype.stopPropagation = function(evt, element) {
	if (this._stopPropagation && this._attributesMatch(element)) {
		return this._stopPropagation;
	}
};

ElementAttributeFilter.prototype._attributesMatch = function(element) {
	var key;
	var attribute;
	for (key in this._attributes) {
		attribute = element.getAttribute(key);
		if (this._attributes[key].indexOf(attribute) !== -1) {
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

module.exports = ElementAttributeFilter;
