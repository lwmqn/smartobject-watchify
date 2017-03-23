var util = require('util'),
    EventEmitter = require('events');

module.exports = function watchify(so) {
    Object.defineProperty(so, '_emitter', { writable: true, enumerable: false, configurable: false, value: new EventEmitter() });
    Object.defineProperty(so, '_originalWrite', { writable: true, enumerable: false, configurable: true, value: so.write });
    Object.defineProperty(so, '_emit', { writable: true, enumerable: false, configurable: false, value: so._emitter.emit });

    so.write = function (oid, iid, rid, value, opt, callback) {
            var self = this;

            if (typeof opt === 'function') {
                callback = opt;
                opt = undefined;
            }

            this.read(oid, iid, rid, function (er, oldValue) {
                self._originalWrite(oid, iid, rid, value, opt, function (err, currentValue) {
                    if (!err && (currentValue !== undefined)) {
                        if (currentValue !== oldValue) {
                            var iPath = oid + '/' + iid + '/';
                            self._emit(iPath, { iPath: iPath, rid: rid, cVal: currentValue, pVal: oldValue });
                            self._emit(oid + '/' + iid + '/' + rid, currentValue, oldValue);
                        }
                    }
                    callback(err, currentValue);
                });
            });
    };

    so.onChange = so._emitter.on;
    so.onChangeOnce = so._emitter.once;

    so.removeListener = so._emitter.removeListener;
    so.removeAllListeners = so._emitter.removeAllListeners;

    return so;
};
