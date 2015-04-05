var ComboKeysContext = require('../Combokeys-Context');

/**
 * Create a filter that will disable callbacks inside certain tags
 * @implements {ContextPlugin}
 * @param {string[]} tagNames A list of tag names
 * @param {object} options
 * @param {Context.StopPropagationReturn=} options.stopPropagation Value for stop propagation on match
 * @param {Context.PreventDefaultReturn=} options.preventDefault Value for prevent default on match
 * @param {Context.StopCallbackReturn=} options.stopCallback Value for stop callback on match
 * @constructor
 */
var TagCallbackFilter = function(tagNames, options) {

	options = options || {};

	// clone the tag names
	this._tagNames = tagNames.map(function(value) {
		return value.toLowerCase();
	});

	this._stopCallback = options.stopCallback;
	this._preventDefault = options.preventDefault;
	this._stopPropagation = options.stopPropagation;
};

TagCallbackFilter.prototype.stopCallback = function(evt, element) {
	if (this._stopCallback && this._attributesMatch(element)) {
		return this._stopCallback;
	}
};

TagCallbackFilter.prototype.preventDefault = function(evt, element) {
	if (this._preventDefault && this._attributesMatch(element)) {
		return this._preventDefault;
	}
};

TagCallbackFilter.prototype.stopPropagation = function(evt, element) {
	if (this._stopPropagation && this._attributesMatch(element)) {
		return this._stopPropagation;
	}
};

TagCallbackFilter.prototype._attributesMatch = function(evt, element) {
	return this._tagNames.indexOf(element.tagName.toLowerCase()) !== -1;
};

module.exports = TagCallbackFilter;
