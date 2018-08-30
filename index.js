var request = require('request');
var Service, Characteristic;

module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;

    homebridge.registerAccessory('homebridge-http-slider', 'Slider', SliderAccessory);
};

function SliderAccessory(log, config) {
    this.log = log;
    log('loaded');
}

SliderAccessory.prototype = {

    getServices: function() {
        var service = [];
        return service;
    }
};
