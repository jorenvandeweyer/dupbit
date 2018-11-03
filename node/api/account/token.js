const destroyToken = require("../../src/util/destroyToken");
const express = require("express");

module.exports = express.Router()
    .all("*", (req, res, next) => {
        if (req.auth.isLoggedIn) {
            next();
        } else {
            res.status(401).json({
                success: false,
                reason: "need to be authenticated",
            });
        }
    })
    .get("*", async (req, res) => {
        res.json({
            success: true, 
            token: req.headers.authorization || req.cookies.sid
        });
    })
    .post("*", async (req, res) => {
        res.status(405).json({
            success: false
        });
    })
    .put("*", async (req, res) => {
        res.status(405).json({
            success: false
        });
    })
    .delete("*", async (req, res) => {
        const data = req.body;
        if (data.tid) {
            res.json({
                success: false,
            });
        } else {        
            await destroyToken(req.auth.tid, req.auth.uid);
        
            res.clearCookie("sid", {
                // secure: true
            });

            res.json({
                success: true,
            });
        }
    });
