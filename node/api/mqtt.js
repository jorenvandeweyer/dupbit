const express = require("express");
const mqtt = require("../src/util/mqtt");

module.exports = express.Router()
    .all("*", (req, res, next) => {
        if (req.auth.isLoggedIn) {
            next();
        } else {
            next();
            // return res.errors.needAuth();
        }
    })
    .get("*", async (req, res) => {
        const data = req.query;
        handle(res, data);
    })
    .post("*", async (req, res) => {
        const data = req.body;
        handle(res, data);
    });

function handle(res, data) {
    if (!data.topic || !data.message) {
        return res.errors.incomplete();
    }
    mqtt.send(data.topic, data.message);
    res.json({
        success: true,
    });
}
