'use strict';

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
function TagCallbackFilter(tagNames, options) {

	var opts = options || {};

	// clone the tag names
	this._tagNames = tagNames.map(function tagNamesLowerCase(value) {
		return value.toLowerCase();
	});

	this._stopCallback = opts.stopCallback;
	this._preventDefault = opts.preventDefault;
	this._stopPropagation = opts.stopPropagation;
}

TagCallbackFilter.prototype.stopCallback = function stopCallback(evt, element) {
	if (this._stopCallback && this._attributesMatch(element)) {
		return this._stopCallback;
	}
};

TagCallbackFilter.prototype.preventDefault = function preventDefault(evt, element) {
	if (this._preventDefault && this._attributesMatch(element)) {
		return this._preventDefault;
	}
};

TagCallbackFilter.prototype.stopPropagation = function stopPropagation(evt, element) {
	if (this._stopPropagation && this._attributesMatch(element)) {
		return this._stopPropagation;
	}
};

TagCallbackFilter.prototype._attributesMatch = function _attributesMatch(evt, element) {
	return this._tagNames.indexOf(element.tagName.toLowerCase()) !== -1;
};

module.exports = TagCallbackFilter;
