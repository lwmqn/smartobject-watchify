smartobject-watchify
========================
An extension to make a smartobject instance listenable to its resource changes  
  
[![NPM](https://nodei.co/npm/smartobject-watchify.png?downloads=true)](https://nodei.co/npm/smartobject-watchify/)  

[![Travis branch](https://img.shields.io/travis/AllSmartObjects/smartobject-watchify/master.svg?maxAge=2592000)](https://travis-ci.org/AllSmartObjects/smartobject-watchify)
[![npm](https://img.shields.io/npm/v/smartobject-watchify.svg?maxAge=2592000)](https://www.npmjs.com/package/smartobject-watchify)
[![PyPI](https://img.shields.io/pypi/status/Django.svg?maxAge=2592000)](https://www.npmjs.com/package/smartobject-watchify)
[![npm](https://img.shields.io/npm/l/smartobject-watchify.svg?maxAge=2592000)](https://www.npmjs.com/package/smartobject-watchify) [![Greenkeeper badge](https://badges.greenkeeper.io/AllSmartObjects/smartobject-watchify.svg)](https://greenkeeper.io/)
[![Coverage Status](https://coveralls.io/repos/github/AllSmartObjects/smartobject-watchify/badge.svg?branch=master)](https://coveralls.io/github/AllSmartObjects/smartobject-watchify?branch=master)

<br />

## 1. Overview

This module is used make a smartobject instance able to listen to its resource changes, which could be helpful for creating a machine node responsive to any reosurce change within it.  

<br />

## 2. Installation

> $ npm install smartobject-watchify --save
  
<br />

## 3. Basic Usage

```js
var SmartObject = require('smartobject'),
    soWatchify = require('smartobject-watchify');

var so = new SmartObject();
so = soWatchify(so);

so.init('temperature', 0, { sensorValue: 31, units : 'C' });

// attach a listener to receive the change from resource 'temperature/0/sensorValue' 
so.onChange('temperature/0/sensorValue', function (cVal, pVal) {
    console.log('A listener to this resource');
    console.log(cVal);  // current value
    console.log(pVal);  // previous value
});

so.onChange('temperature/0/sensorValue', function (cVal, pVal) {
    console.log('Another listener to this resource');
});

// Modify the sensorValue of the temperature sensor and the listener will be triggered
so.write('temperature', 0, 'sensorValue', 80, function (err, data) {
    if (err)
        console.log(err);
});
```

<br />

## 4. APIs
<a name="API_extend"></a>
<br />
*************************************************
### require('smartobject-watchify')(so)
`smartobject-watchify` exports a function that receives the smartobject instance as the parameter to be extended and returned.  

**Arguments:**  

1. `so` (_Object_): The instance of SmartObject class.  
  
**Returns:**  

* (_Object_) Watchified smartobject.

**Examples:**  
  
```js
var SmartObject = require('smartobject'),
    soWatchify = require('smartobject-watchify');

var so = soWatchify(new SmartObject());
```

<a name="API_onChange"></a>
<br />
*************************************************
### so.onChange(path, listener)
Attach a listener to observe a given resource for its change.  

**Arguments:**  

1. `path` (_String_): The path to the resource, e.g. `'humidity/6/sensorValue'`.  
2. `listener` (_Function_): `function(cVal, pVal) {}`, where `cVal` is the current value and `pVal` is the previous value before updated.  

  
**Returns:**  

* (_none_)  

**Examples:**  
  
```js
so.onChange('temperature/3/sensorValue', function (cVal, pVal) {
    // Listen to 'temperature/3/sensorValue' for its change
});
```

<a name="API_onChangeOnce"></a>
<br />
*************************************************
### so.onChangeOnce(path, listener)
Attach an one-time listener to observe a given resource for its change.  

**Arguments:**  

1. `path` (_String_): The path to the resource, e.g. `'humidity/6/sensorValue'`.  
2. `listener` (_Function_): `function(cVal, pVal) {}`, where `cVal` is the current value and `pVal` is the previous value before updated.  
  
**Returns:**  

* (_Constructor_) WatchifiedSmartObject

**Examples:**  
  
```js
so.onChangeOnce('presence/7/dInState', function (cVal, pVal) {
    // Listen to 'presence/7/dInState' only once for its change
});
```

<a name="API_removeListener"></a>
<br />
*************************************************
### so.removeListener(path, listener)
Remove a specified listener from listening to the given resource path.  

**Arguments:**  

1. `path` (_String_): The path to the resource, e.g. `'humidity/6/sensorValue'`.  
2. `listener` (_Function_): The listener function.  
  
**Returns:**  

* (_none_)

**Examples:**  
  
```js
var presenceListener = function (cVal, pVal) {
    // Listen to 'presence/7/dInState' only once for its change
};

// attach listener
so.onChange('presence/7/dInState', presenceListener);

// remove listener
so.removeListener('presence/7/dInState', presenceListener);
```

<a name="API_removeAllListeners"></a>
<br />
*************************************************
### so.removeAllListeners(path)
Remove all listeners from listening to the given resource path.  

**Arguments:**  

1. `path` (_String_): The path to the resource, e.g. `'humidity/6/sensorValue'`.  
  
**Returns:**  

* (_none_)

**Examples:**  
  
```js
so.removeAllListeners('temperature/0/sensorValue');
```

<br />
## License

Licensed under [MIT](https://github.com/AllSmartObjects/smartobject-watchify/blob/master/LICENSE).
