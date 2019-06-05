/* eslint-env mocha */
const chai = require('chai')
const { expect } = chai
const SmartObject = require('smartobject')
const watchify = require('../index.js')

describe('Functional Check', () => {
  let so = new SmartObject()
  so = watchify(so)

  it('should be inherited from SmartObject', () => {
    expect(so instanceof SmartObject).to.be.equal(true)
  })

  it('should be composition of a EventEmitter', () => {
    expect(so._emit).to.be.a('function')
    expect(so.onChange).to.be.a('function')
    expect(so.onChangeOnce).to.be.a('function')
    expect(so.removeListener).to.be.a('function')
    expect(so.removeAllListeners).to.be.a('function')
  })

  it('should fire and listened via onChange correctly', (done) => {
    so.onChange('hello', (data) => {
      if (data === 1) done()
    })

    setImmediate(() => {
      so._emit('hello', 1)
    })
  })

  it('should fire and listened via on correctly', (done) => {
    so.onChange('helloY', (data) => {
      if (data === 1) done()
    })

    setImmediate(() => {
      so._emit('helloY', 1)
    })
  })

  it('should init correctly', () => {
    so.init('temperature', 0, {
      sensorValue: 31,
      units: 'C'
    })

    so.init('temperature', 1, {
      _state: { // inner state
        foo: 'bar'
      },
      sensorValue: 75,
      units: 'F'
    })

    so.init(3303, 18, {
      sensorValue: 301,
      units: 'K'
    }, function () {
      // this._state is an empty object by default
      // you can attach things to it
      this._state.foo = 'bar'
    })

    expect(so.get('temperature', 0, 'sensorValue')).to.be.equal(31)
    expect(so.get('temperature', 1, 'sensorValue')).to.be.equal(75)
    expect(so.get(3303, 18, 'sensorValue')).to.be.equal(301)
  })

  it('should report change of temperature/1/sensorValue correctly', (done) => {
    so.onChange('temperature/1/sensorValue', (cVal, pVal) => {
      if (cVal === 80 && pVal === 75) done()
    })
    so.write('temperature', 1, 'sensorValue', 80, (err, data) => {
      expect(err).to.be.equal(null)
      // console.log(err);
      // console.log(data);
    })
  })

  it('should report change of temperature/1/ correctly', (done) => {
    so.onChange('temperature/1/', (rRec) => {
      if (rRec.rid === 'sensorValue' && rRec.cVal === 30 && rRec.pVal === 80) done()
    })
    so.write('temperature', 1, 'sensorValue', 30, (err, data) => {
      expect(err).to.be.equal(null)
      // console.log(err);
      // console.log(data);
    })
  })

  it('should report change of temperature/0/sensorValue correctly', (done) => {
    so.onChange('temperature/0/sensorValue', (cVal, pVal) => {
      if (cVal === 12 && pVal === 31) done()
    })
    so.write('temperature', 0, 'sensorValue', 12, (err, data) => {
      expect(err).to.be.equal(null)
      // console.log(err);
      // console.log(data);
    })
  })

  it('should report change of temperature/0/sensorValue correctly', (done) => {
    so.onChange('temperature/0/sensorValue', (cVal, pVal) => {
      if (cVal === 55 && pVal === 12) done()
    })
    so.write('temperature', 0, 'sensorValue', 55, (err, data) => {
      expect(err).to.be.equal(null)
      // console.log(err);
      // console.log(data);
    })
  })

  it('should report change of 3303/18/sensorValue correctly', (done) => {
    so.onChange('3303/18/sensorValue', (cVal, pVal) => {
      if (cVal === 307 && pVal === 301) done()
    })
    so.write('3303', 18, 'sensorValue', 307, (err, data) => {
      expect(err).to.be.equal(null)
      // console.log(err);
      // console.log(data);
    })
  })

  it('should report change of 3303/18/ correctly', (done) => {
    so.onChange('3303/18/', (rRec) => {
      if (rRec.rid === 'sensorValue' && rRec.cVal === 99 && rRec.pVal === 307) done()
    })
    so.write('3303', 18, 'sensorValue', 99, (err, data) => {
      expect(err).to.be.equal(null)
      // console.log(err);
      // console.log(data);
    })
  })
})
