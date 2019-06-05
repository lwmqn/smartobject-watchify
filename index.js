const EventEmitter = require('events')

module.exports = function watchify (so) {
  Object.defineProperty(so, '_emitter', {
    writable: true, enumerable: false, configurable: false, value: new EventEmitter()
  })
  Object.defineProperty(so, '_originalWrite', {
    writable: true, enumerable: false, configurable: true, value: so.write
  })
  Object.defineProperty(so, '_emit', {
    writable: true, enumerable: false, configurable: false, value: so._emitter.emit
  })

  so.write = function (oid, iid, rid, value, opt, callback) {
    const self = this

    if (typeof opt === 'function') {
      callback = opt
      opt = undefined
    }

    this.read(oid, iid, rid, (er, oldValue) => {
      self._originalWrite(oid, iid, rid, value, opt, (err, currentValue) => {
        if (!err && (currentValue !== undefined)) {
          if (currentValue !== oldValue) {
            const iPath = `${oid}/${iid}/`
            self._emit(iPath, {
              iPath, rid, cVal: currentValue, pVal: oldValue
            })
            self._emit(`${oid}/${iid}/${rid}`, currentValue, oldValue)
          }
        }
        callback(err, currentValue)
      })
    })
  }

  so.onChange = so._emitter.on
  so.onChangeOnce = so._emitter.once

  so.removeListener = so._emitter.removeListener
  so.removeAllListeners = so._emitter.removeAllListeners

  return so
}
