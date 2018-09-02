/* eslint-env mocha */

var assert = require('assert');
var nock = require('nock');

/*
 * Mocks
 */

var log = function(){};

/*
var log = console.log;
log.debug = console.log;
*/

var Homebridge = require('./mocks/homebridge.js')(undefined);
var Service = Homebridge.hap.Service;
var Characteristic = Homebridge.hap.Characteristic;

/*
 * Load Plugin
 */
require('../index.js')(Homebridge);
var AccessoryType = Homebridge.AccessoryType;

/*
 * Tests
 */

describe('Reqister Accessory', function() {
    it('should register the correct plugin name', function() {
        assert(Homebridge.pluginName, 'homebridge-http-slider');
    });
    it('should register the correct config name', function() {
        assert(Homebridge.configName, 'Slider');
    });
    it('should have a valid accessory type', function() {
        assert.ok(AccessoryType);
    });
});

describe('Accessory configs', function() {
    describe('light 1', function() {
        var config = {
            accessory:   'Slider',
            service:     'Lightbulb',
            http_states: ['http://127.0.0.1/0', 'http://127.0.0.1/1']
        };
        var slider = new AccessoryType(log, config);
        var light_service;
        it('should include the light bulb service', function() {
            slider.getServices().forEach(function(s) {
                if (s instanceof Service.Lightbulb)
                    light_service = s;
            });
            assert.ok(light_service);
        });
        it('should make the correct request 1', function(done) {
            nock('http://127.0.0.1').get('/0').reply(200, '');
            light_service
                .getCharacteristic(Characteristic.Brightness)
                .emit('set', 40, function(){});
            setTimeout(function() {
                if (nock.isDone())
                    done();
                else
                    done('nock was not done!');
            }, 1600);
        });
        it('should make the correct request 2', function(done) {
            nock('http://127.0.0.1').get('/1').reply(200, '');
            light_service
                .getCharacteristic(Characteristic.Brightness)
                .emit('set', 60, function(){});
            setTimeout(function() {
                if (nock.isDone())
                    done();
                else
                    done('nock was not done!');
            }, 1600);
        });
        it('should return the correct value 1', function(done) {
            light_service
                .getCharacteristic(Characteristic.Brightness)
                .emit('set', 40, function(error, state){
                    if (state === 0)
                        done();
                    else
                        done('wrong state returned: ' + state);
                });
        });
        it('should return the correct value 2', function(done) {
            light_service
                .getCharacteristic(Characteristic.Brightness)
                .emit('set', 60, function(error, state){
                    if (state === 100)
                        done();
                    else
                        done('wrong state returned: ' + state);
                });
        });
    });
    describe('light 2 bigger', function() {
        var config = {
            accessory:   'Slider',
            service:     'Lightbulb',
            http_states: [
                'http://127.0.0.1/0', 
                'http://127.0.0.1/1', 
                'http://127.0.0.1/2', 
                'http://127.0.0.1/3', 
            ]
        };
        var slider = new AccessoryType(log, config);
        var light_service;
        it('should include the light bulb service', function() {
            slider.getServices().forEach(function(s) {
                if (s instanceof Service.Lightbulb)
                    light_service = s;
            });
            assert.ok(light_service);
        });
        describe('Correct request to url ending "/0"', function() {
            it('should request the correct url (1)', function(done) {
                nock('http://127.0.0.1').get('/0').reply(200, '');
                light_service
                    .getCharacteristic(Characteristic.Brightness)
                    .emit('set', 0, function(){});
                setTimeout(function() {
                    if (nock.isDone())
                        done();
                    else
                        done('nock was not done!');
                }, 1600);
            });
            it('should request the correct url (2)', function(done) {
                nock('http://127.0.0.1').get('/0').reply(200, '');
                light_service
                    .getCharacteristic(Characteristic.Brightness)
                    .emit('set', 15, function(){});
                setTimeout(function() {
                    if (nock.isDone())
                        done();
                    else
                        done('nock was not done!');
                }, 1600);
            });
        });
        describe('Correct request to url ending "/1"', function() {
            it('should request the correct url (1)', function(done) {
                nock('http://127.0.0.1').get('/1').reply(200, '');
                light_service
                    .getCharacteristic(Characteristic.Brightness)
                    .emit('set', 20, function(){});
                setTimeout(function() {
                    if (nock.isDone())
                        done();
                    else
                        done('nock was not done!');
                }, 1600);
            });
            it('should request the correct url (2)', function(done) {
                nock('http://127.0.0.1').get('/1').reply(200, '');
                light_service
                    .getCharacteristic(Characteristic.Brightness)
                    .emit('set', 49, function(){});
                setTimeout(function() {
                    if (nock.isDone())
                        done();
                    else
                        done('nock was not done!');
                }, 1600);
            });
        });
        describe('Correct request to url ending "/2"', function() {
            it('should request the correct url (1)', function(done) {
                nock('http://127.0.0.1').get('/2').reply(200, '');
                light_service
                    .getCharacteristic(Characteristic.Brightness)
                    .emit('set', 51, function(){});
                setTimeout(function() {
                    if (nock.isDone())
                        done();
                    else
                        done('nock was not done!');
                }, 1600);
            });
            it('should request the correct url (2)', function(done) {
                nock('http://127.0.0.1').get('/2').reply(200, '');
                light_service
                    .getCharacteristic(Characteristic.Brightness)
                    .emit('set', 75, function(){});
                setTimeout(function() {
                    if (nock.isDone())
                        done();
                    else
                        done('nock was not done!');
                }, 1600);
            });
        });
        describe('Correct request to url ending "/3"', function() {
            it('should request the correct url (1)', function(done) {
                nock('http://127.0.0.1').get('/3').reply(200, '');
                light_service
                    .getCharacteristic(Characteristic.Brightness)
                    .emit('set', 90, function(){});
                setTimeout(function() {
                    if (nock.isDone())
                        done();
                    else
                        done('nock was not done!');
                }, 1600);
            });
            it('should request the correct url (2)', function(done) {
                nock('http://127.0.0.1').get('/3').reply(200, '');
                light_service
                    .getCharacteristic(Characteristic.Brightness)
                    .emit('set', 100, function(){});
                setTimeout(function() {
                    if (nock.isDone())
                        done();
                    else
                        done('nock was not done!');
                }, 1600);
            });
        });
    });
    describe('fan 1', function() {
    });
    describe('thermostat 1', function() {
    });
});
