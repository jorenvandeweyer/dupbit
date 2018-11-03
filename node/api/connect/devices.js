const express = require("express");
const ws = require("../../src/websocket/index");
const db = require("../../src/util/Database");

module.exports = express.Router()
    .all("*", (req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        if (req.auth.isLoggedIn) {
            next();
        } else {
            res.status(401).json({
                success: false,
                reason: "need to be authenticated"
            });
        }
    })
    .get("*", async (req, res) => {
        const tokens = await db.getTokens(req.auth.uid);
        const sockets = await ws.getClient(req.auth.uid);

        tokens.forEach(token => {
            token.online = sockets && sockets.has(token.tid);
        });

        res.json({
            success: true,
            tokens,
        });
    })
    .post("*", async (req, res) => {
        const data = req.body;
        if (data.tid && data.identifier) {
            const token = await db.getToken(data.tid);
            if (token && token[0].uid === req.auth.uid) {
                db.setTokenIdentifier(data.tid, data.identifier);
            } else {
                res.json({
                    success: false,
                    reason: "not a token",
                });
            }
        } else {
            res.json({
                success: false,
                reason: "need tid & identifier",
            });
        }
    })
    .put("*", async (req, res) => {
        res.json({
            success: false,
        });
    })
    .delete("*", async (req, res) => {
        res.json({
            success: false,
        });
    });
