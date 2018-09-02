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
    this.name = config.name;
}

SliderAccessory.prototype = {

    getServices: function() {
        var services = [];

        this.section = 0;

        var info = new Service.AccessoryInformation();
        info.setCharacteristic(Characteristic.Name, this.name)
            .setCharacteristic(Characteristic.Manufacturer, 'Programmed by Marvin Dostal')
            .setCharacteristic(Characteristic.Model, '-')
            .setCharacteristic(Characteristic.FirmwareRevision, '-')
            .setCharacteristic(Characteristic.SerialNumber, '-');

        services.push(info);

        startRequestInterval(this.config.request_interval || 1500);

        if (this.config.service === 'Lightbulb') {
            this.lightbulb = new Service.Lightbulb(this.name + ' Slider');
            this.lightbulb
                .getCharacteristic(Characteristic.On)
                .on('get', function(callback) {
                    callback(null, true);
                })
                .on('set', function(state, callback) {
                    callback(null);
                    reset(this.lightbulb, Characteristic.On);
                }.bind(this));
            this.lightbulb
                .getCharacteristic(Characteristic.Brightness)
                .on('get', function(callback) {
                    callback(null, this.section);
                }.bind(this))
                .on('set', function(state, callback) {
                    var number_of_states = this.config.http_states.length;
                    var interval = 100 / (number_of_states - 1);
                    var interval_half = interval / 2;
                    for (var i = 0; i < number_of_states; i++) {
                        var section = interval * i;
                        if (state - section < interval_half && 
                            state - section >= -interval_half) {
                            setNextRequest(this.config.http_states[i]);
                            callback(null, section);

                            this.log(section);

                            this.section = section;
                            reset(this.lightbulb, Characteristic.Brightness, 500);
                            return;
                        }
                    }
                }.bind(this));

            services.push(this.lightbulb);
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

/*
 * Request organizer
 */
var callrequest = false;
var callhttp = '';

var setNextRequest = function(url) {
    callhttp = url;
    callrequest = true;
};

var startRequestInterval = function(interval) {
    setInterval(function() {
        if (callrequest) {
            callrequest = false;
            if (callhttp !== '')
                request(callhttp, function() {});
        }
    }, interval);
};
