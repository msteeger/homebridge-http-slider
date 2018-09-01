/*
 *  _   _ _   _              ____  _ _     _
 * | | | | |_| |_ _ __      / ___|| (_) __| | ___ _ __
 * | |_| | __| __| '_ \ ____\___ \| | |/ _` |/ _ \ '__|
 * |  _  | |_| |_| |_) |_____|__) | | | (_| |  __/ |
 * |_| |_|\__|\__| .__/     |____/|_|_|\__,_|\___|_|
 *               |_|
 *
 * A homebridge plugin
 *
 */

var request = require('request');
var Service, Characteristic;

module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;

    homebridge.registerAccessory('homebridge-http-slider', 'Slider', SliderAccessory);
};

function SliderAccessory(log, config) {
    this.log = log;
    log('Starting http-slider');
    this.config = config;
}

SliderAccessory.prototype = {

    getServices: function() {
        var services = [];

        if (this.config.service === 'LightBulb') {
            this.lightBulb = new Service.Lightbulb('LightBulb Slider');
            this.lightBulb
                .getCharacteristic(Characteristic.On)
                .on('get', function(callback) {
                    callback(null, true);
                })
                .on('set', function(state, callback) {
                    callback(null);
                    reset(this.lightBulb, Characteristic.On);
                }.bind(this));
            this.lightBulb
                .getCharacteristic(Characteristic.Brightness)
                .on('set', function(state, callback) {
                    var number_of_states = this.config.http_states.length;
                    var interval_half = 100 / number_of_states;
                    var interval = 2 * interval_half;
                    for (var i = 0; i < number_of_states; i++) {
                        var section = interval * i;
                        if (state - section < interval_half && 
                            state - section >= -interval_half) {
                            request(this.config.http_states[i], function(){});
                            callback(null, section);
                            return;
                        }
                    }
                }.bind(this));

            services.push(this.lightBulb);
        }

        return services;
    }
};

/**
 * Resets a characteristic of a service by using a getter callback with a 
 * specific delay
 *
 * @param {Service} service The service
 * @param {Characteristic} characterisitc The characteristic of the service to reset
 * @param {number} delay The delay when the reset takes place
 */
var reset = function(service, characteristic, delay){
    if (!delay) {
        // default value without ECMAscript 6 features
        delay = 1000;
    }

    setTimeout(function() {
        service.getCharacteristic(characteristic).emit('get', function(error, newValue) {
            service
                .getCharacteristic(characteristic)
                .updateValue(newValue);
        });
    }, delay);
};
