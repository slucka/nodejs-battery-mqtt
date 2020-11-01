const mqtt = require('mqtt');
const batteryLevel = require('battery-level');

const deviceId = 'oblap002';
const mqttServer = 'mqtt://192.168.1.107';
const mqttClientId = 'mqttjs01';

var client = null;


client = mqtt.connect(mqttServer, { clientId: mqttClientId });

client.on("connect", function () {
    console.log("connected");
    client.publish("hello", "hello world");
    client.subscribe('device/' + deviceId);
});
client.on("error", function (error) {
    console.log("Can't connect" + error);
});
client.on('message', (topic, message) => {
    //if (topic === 'device/oblap002') {
    //    connected = (message.toString() === 'true');
    //}
    console.log("topic: " + topic);
    console.log("message: " + message);
});


function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

setInterval(function () {

    

    batteryLevel().then(level => {

        var valueRef = parseInt(level * 100);

        var data1 = {
            "id" : deviceId,
            "param": "thermostatTemperatureAmbient",
            "value": valueRef,
            "intent": "rules",
        };
        var json = JSON.stringify(data1);
        console.log("publish: " + json);
        client.publish("device/control", json);
    
        var data2 = {
            "id" : deviceId,
            "param": "temperature",
            "value": valueRef,
            "intent": "rules",
        };
        json = JSON.stringify(data2);
        console.log("publish: " + json);
        client.publish("device/control", json);

    
    });


}, 10000);