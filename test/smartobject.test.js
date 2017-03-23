var chai = require('chai'),
    expect = chai.expect,
    EventEmitter = require('events'),
    SmartObject = require('smartobject'),
    watchify = require('../index.js');

describe('Functional Check', function () {
    var so = new SmartObject();
    so = watchify(so);

    it('should be inherited from SmartObject', function () {
        expect(so instanceof SmartObject).to.be.equal(true);
    });

    it('should be composition of a EventEmitter', function () {
        expect(so._emit).to.be.a('function');
        expect(so.onChange).to.be.a('function');
        expect(so.onChangeOnce).to.be.a('function');
        expect(so.removeListener).to.be.a('function');
        expect(so.removeAllListeners).to.be.a('function');
    });

    it('should fire and listened via onChange correctly', function (done) {
        so.onChange('hello', function (data) {
            if (data === 1)
                done();
        });

        setImmediate(function () {
            so._emit('hello', 1);
        });
    });

    it('should fire and listened via on correctly', function (done) {
        so.onChange('helloY', function (data) {
            if (data === 1)
                done();
        });

        setImmediate(function () {
            so._emit('helloY', 1);
        });
    });

    it('should init correctly', function () {
        so.init('temperature', 0, {
            sensorValue: 31,
            units : 'C'
        });

        so.init('temperature', 1, {
            _state: {           // inner state
                foo: 'bar'
            },
            sensorValue: 75,
            units : 'F'
        });

        so.init(3303, 18, {
            sensorValue: 301,
            units : 'K'
        }, function () {
            // this._state is an empty object by default
            // you can attach things to it
            this._state.foo = 'bar';
        });

        expect(so.get('temperature', 0, 'sensorValue')).to.be.equal(31);
        expect(so.get('temperature', 1, 'sensorValue')).to.be.equal(75);
        expect(so.get(3303, 18, 'sensorValue')).to.be.equal(301);
    });

    it('should report change of temperature/1/sensorValue correctly', function (done) {
        so.onChange('temperature/1/sensorValue', function (cVal, oVal) {
            if (cVal === 80 && oVal === 75)
                done();
        });
        so.write('temperature', 1, 'sensorValue', 80, function (err, data) {
            // console.log(err);
            // console.log(data);
        });
    });

    it('should report change of temperature/0/sensorValue correctly', function (done) {
        so.onChange('temperature/0/sensorValue', function (cVal, oVal) {
            if (cVal === 12 && oVal === 31)
                done();
        });
        so.write('temperature', 0, 'sensorValue', 12, function (err, data) {
            // console.log(err);
            // console.log(data);
        });
    });

    it('should report change of temperature/0/sensorValue correctly', function (done) {
        so.onChange('temperature/0/sensorValue', function (cVal, oVal) {
            if (cVal === 55 && oVal === 12)
                done();
        });
        so.write('temperature', 0, 'sensorValue', 55, function (err, data) {
            // console.log(err);
            // console.log(data);
        });
    });

    it('should report change of 3303/18/sensorValue correctly', function (done) {
        so.onChange('3303/18/sensorValue', function (cVal, oVal) {
            if (cVal === 307 && oVal === 301)
                done();
        });
        so.write('3303', 18, 'sensorValue', 307, function (err, data) {
            // console.log(err);
            // console.log(data);
        });
    });
});