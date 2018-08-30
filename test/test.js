/* eslint-env mocha */

var assert = require('assert');
var nock = require('nock');

/*
 * Mocks
 */
var log = function(){};
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
    var config = {};
    var slider;
    describe('thermostat 1', function() {
        config = {};
        slider = new AccessoryType(log, config);
    });
    describe('light 1', function() {
    });
    describe('fan 1', function() {
    });
});
