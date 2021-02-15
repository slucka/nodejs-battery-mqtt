var mqtt = require('mqtt');
var batteryLevel = require('battery-level');
var ping = require('ping');
var log4js = require("log4js");

//log4js.configure( "./config/log4js.json" );
//var logger = log4js.getLogger( "test-file-appender" );
// log4js.configure({
//     appenders: { cheese: { type: "file", filename: "cheese.log" } },
//     categories: { default: { appenders: ["cheese"], level: "error" } }
// });
// //layout: { type: "pattern", pattern: "%d{dd/MM hh:mm} %-5p %m"
// var logger = log4js.getLogger("cheese");
log4js.configure( "./config/log4js.json" );
var logger = log4js.getLogger('battery-level');
  
logger.info("start battery-level");

var deviceId = 'oblap002';
var mqttServer = 'mqtt://192.168.1.107';
var mqttClientId = 'mqttjs01';

//var hosts = ['192.168.182.129', 'google.com', 'yahoo.com'];
//var vm_ip = '192.168.182.129';
var vm_ip = 'VM-WIN10-DESA';

var client = null;
client = mqtt.connect(mqttServer, { clientId: mqttClientId });
client.on("connect", function () {
    //console.log("connected");
    logger.info("connected");
    client.publish("hello", "hello world");
    client.subscribe('device/' + deviceId);
});
client.on("error", function (error) {
    //console.log("Can't connect" + error);
    logger.error("Can't connect");
});
client.on('message', (topic, message) => {
    //if (topic === 'device/oblap002') {
    //    connected = (message.toString() === 'true');
    //}

    //console.log("topic: " + topic);
    //console.log("message: " + message);
    logger.info("topic: " + topic);
    logger.info("message: " + message);

});


function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function sendMttqData(level) {

    
    var valueRef = parseInt(level * 100);
    console.log("level: " + valueRef);

    var data1 = {
        "id": deviceId,
        "param": "thermostatTemperatureAmbient",
        "value": valueRef,
        "intent": "rules",
    };
    var json = JSON.stringify(data1);
    //console.log("publish: " + json);
    logger.info("publish: " + json);
    client.publish("device/control", json);

    var data2 = {
        "id": deviceId,
        "param": "temperature",
        "value": valueRef,
        "intent": "rules",
    };
    json = JSON.stringify(data2);
    //console.log("publish: " + json);
    logger.info("publish: " + json);
    client.publish("device/control", json);
}

setInterval(function () {

    // batteryLevel().then(level => {

    //     var valueRef = parseInt(level * 100);

    //     var data1 = {
    //         "id" : deviceId,
    //         "param": "thermostatTemperatureAmbient",
    //         "value": valueRef,
    //         "intent": "rules",
    //     };
    //     var json = JSON.stringify(data1);
    //     console.log("publish: " + json);
    //     client.publish("device/control", json);

    //     var data2 = {
    //         "id" : deviceId,
    //         "param": "temperature",
    //         "value": valueRef,
    //         "intent": "rules",
    //     };
    //     json = JSON.stringify(data2);
    //     console.log("publish: " + json);
    //     client.publish("device/control", json);


    // });



    // hosts.forEach(function(host){
    //     ping.sys.probe(host, function(isAlive){
    //         var msg = isAlive ? 'host ' + host + ' is alive' : 'host ' + host + ' is dead';
    //         console.log(msg);
    //     });
    // });

    ping.sys.probe(vm_ip, function (isAlive) {
        if (isAlive) {
            console.log("Is Alive");
            logger.info('############### Is Alive ###############');
            sendMttqData(0.1)
        } else {
            console.log("Is Not Alive");
            logger.info('############### Is Not Alive ###############');
            batteryLevel().then(level => {
                sendMttqData(level)
            });
        }
    });

}, 10000);