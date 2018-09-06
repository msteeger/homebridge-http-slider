# homebridge-http-slider
A homebridge plugin to provide a simple slider, that calls specific http-urls
at specific states.

# Installation
1. Install [Homebridge](https://github.com/nfarina/homebridge)
2. Install this plugin `sudo npm install -g homebridge-http-slider`
3. Add this plugin as accessory to your `config.json` file

## Configuration
Inside the Homebridge `config.json`

Mandatory
```json
...
    "accessories": [
        {
```

Mandatory
```json
            "accessory": "Slider",
            "name": "Slider Name",
            "service": "Lightbulb",
            "http_states": [
                "http://127.0.0.1/0",
                "http://127.0.0.1/1",
                "http://127.0.0.1/2"
            ],
```
* `name` can be freely chosen
* Supported `service`s are `Lightbulb`, `Fan` and `Thermostat`
* `http_states` http-urls who get called when the slider gets set to a specific
  state. A low index in the array represents a low value/state in the slider.

Optional
```json
            "thermo_range_high": 100,
            "thermo_range_low": 0
```
* Interval of values when using the `Thermostat` service

```json
        },
...
```
