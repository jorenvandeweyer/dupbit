const mqtt = require("mqtt");
const { MQTT_USER, MQTT_PASS } = require("../../config.json");

const client = mqtt.connect('mqtt://dupbit.com', {
    username: MQTT_USER,
    password: MQTT_PASS,
});

console.log("started mqtt");

client.on('connect', () => {
    client.subscribe('presence', (err) => {
        if (!err) {
            client.publish('presence', 'dupbit-server');
        }
    })
});

client.on('close', () => {
    // client.reconnect();
});

client.on('error', (err) => {
    client.end();
    console.log("error:", err);
});

client.on('message', (topic, message) => {
    console.log("mqtt receive:", topic, message.toString());
});

function send(topic, message) {
    console.log("mqtt send:", topic, message);
    client.publish(topic, message);
}

module.exports = {
    send,
}
