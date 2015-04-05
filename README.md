# ComboKeys Context

[![Dependency Status](https://david-dm.org/MitMaro/combokeys-context.svg)](https://david-dm.org/MitMaro/combokeys-context)
[![Build Status](https://travis-ci.org/MitMaro/combokeys-context.svg?branch=master)](https://travis-ci.org/MitMaro/combokeys-context)
[![Coverage Status](https://coveralls.io/repos/MitMaro/combokeys-context/badge.svg?branch=master)](https://coveralls.io/r/MitMaro/combokeys-context?branch=master)
[![NPM version](https://img.shields.io/npm/v/combokeys-context.svg)](https://www.npmjs.com/package/combokeys-context)

This is a light wrapper about [ComboKeys](https://github.com/PolicyStat/combokeys) that provides context aware key
bindings.

## Version 1.x Info

For the current stable version, please see the [v1.x branch](https://github.com/MitMaro/combokeys-context/tree/v1.x). The
master branch is for the work in the upcoming version 2 which will have plugin support as well as a more powerful context
system.

## Compatibility

Tested against the latest version of Google Chrome, latest Firefox, and Internet Explorer 9, 10 and 11. Should work with all
browsers that works with ComboKeys as long as `Object.keys` is polyfilled where needed.

## Install

    npm install combokeys-context

## Documentation

### Full API Docs
[ComboKeys Context JSDocs](http://www.mitmaro.ca/combokeys-context/documentation/latest/)

### Basic Usage

```javascript
var ComboKeys = require('combokeys');
var ComboKeysContext = require('combokeys-context');

var comboKeys = new ComboKeys(document);
var comboKeysContext = new ComboKeysContext(comboKeys);

// register a plugin
comboKeysContext.registerPlugin(new ComboKeysContext.plugins.TagCallbackFilter(['input']);

// define callbacks
var callbackGlobal = function(evt, key) {
	// `this` is a reference to comboKeys
	console.log('Global: ' + key);
}
var callbackContext = function(evt, key) {
	console.log('Context A: ' + key);
}

// bind in the global context
comboKeysContext.bind('alt+a', callback);
comboKeysContext.bind('alt+b', callback);

// bind into a context
comboKeysContext.bind('alt+b', 'contextA', callback);

// alt-a press would result in Global: alt+a
// alt-b press would result in Global: alt+b

comboKeysContext.switchContext('contextA');
// alt-a press would result in Global: alt+a
// alt-b press would result in Context A: alt+b

// return to global only state
comboKeysContext.clearContext();

// unbind the global, leaving contextA along
comboKeysContext.unbind('alt+b');
// unbind contextA
comboKeysContext.unbind('alt+b', 'contextA');
// unbind all will remove global and all context bindings
comboKeysContext.unbindAll('alt+b');

// reset will remove all bindings, will also reset ComboKeys
comboKeysContext.reset();
```

### ComboKeys Compatibility

This library modifies `ComboKeys.stopCallback` to add support for
plugins. By default this library will not stop a callback in input
tags or respond to the `combokeys` class on an element. To add this
support you can use the `TagCallbackFilter`, `ElementAttributeFilter`
and the `ClassNameFilter` plugins.

    var comboKeysContext = new ComboKeysContext(new ComboKeys());
    comboKeysContext.registerPlugin(new TagCallbackFilter(['input', 'select', 'textarea']));
    comboKeysContext.registerPlugin(new ClassNameFilter(['combokeys'], false);
    comboKeysContext.registerPlugin(new ElementAttributeFilter({
        isContentEditable: 'true'
    }, {
        StopPropagationReturn: ComboKeysContext.STOP_CALLBACK
    });

## License

Combokeys Context is released under the ISC license. See LICENSE.
