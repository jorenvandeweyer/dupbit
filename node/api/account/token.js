const Token = require("../../src/util/Token");
const ws = require("../../src/websocket/index");

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
            const connection = ws.findConnection(req.auth.uid, req.auth.tid);
            if (connection) connection.close();
        
            await Token.removeToken(req.auth.tid);
        
            res.clearCookie("sid", {
                // secure: true
            });

            res.json({
                success: true,
            });
        }
    });
