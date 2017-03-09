var util = require('util'),
    EventEmitter = require('events');

module.exports = function (SmartObjectClass) {

    function WatchifiedSmartObject () {
        this._emitter = new EventEmitter();

        SmartObjectClass.apply(this, arguments);

        SmartObjectClass.prototype._originalWrite = SmartObjectClass.prototype.write;

        SmartObjectClass.prototype.write = function (oid, iid, rid, value, opt, callback) {
            var self = this;

            if (typeof opt === 'function') {
                callback = opt;
                opt = undefined;
            }

            this.read(oid, iid, rid, function (er, oldValue) {
                self._originalWrite(oid, iid, rid, value, opt, function (err, currentValue) {
                    if (!err && (currentValue !== undefined)) {
                        if (currentValue !== oldValue)
                            self._emit(oid + '/' + iid + '/' + rid, currentValue, oldValue);
                    }
                    callback(err, currentValue);
                });
            });
        };

        Object.defineProperty(this, '_emit', { writable: true, enumerable: false, configurable: false, value: this._emitter.emit });

        this.onChange = this._emitter.on;
        this.onChangeOnce = this._emitter.once;

        this.removeListener = this._emitter.removeListener;
        this.removeAllListeners = this._emitter.removeAllListeners;
    };

    util.inherits(WatchifiedSmartObject, SmartObjectClass);

    return WatchifiedSmartObject;
};
