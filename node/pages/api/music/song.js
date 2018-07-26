const express = require("express");

module.exports = express.Router()
    .all("*", (req, res, next) => {
        if (req.auth.isLoggedIn && req.auth.level >= 3) {
            next();
        } else {
            res.status(401).json({
                success: false,
                reason: "need to be authenticated",
            });
        }
    })
    .get("*", (req, res) => {

    })
    .post("*", (req, res) => {

    })
    .put("*", (req, res) => {

    })
    .delete("*", (req, res) => {

    });
