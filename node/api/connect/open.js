const express = require("express");
const ws = require("../../src/websocket/index");
// const db = require("../../src/util/Database");

module.exports = express.Router()
    .all("*", (req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        if (req.auth.isLoggedIn && req.auth.level >= 2 || req.method === "PUT") {
            next();
        } else {
            res.status(401).json({
                success: false,
                reason: "need to be authenticated"
            });
        }
    })
    .get("*", async (req, res) => {
        let sockets = await ws.getClient(req.auth.id);
        if (sockets.size) {
            sockets = Array.from(sockets.keys()).map(key => new Object({
                id: key,
                identifier: sockets.get(key).identifier,
                tokenInfo: sockets.get(key).owner,
            }));
        } else {
            sockets = [];
        }

        res.json({
            success: true,
            sockets,
        });
    })
    .post("*", async (req, res) => {
        const data = req.body;
        if (data.tid && data.call) {
            const socket = ws.findConnection(req.auth.id, data.tid);

            if (socket) {
                waitForResponse(socket, data).then((data) => {
                    res.json(data);
                });
                socket.send(JSON.stringify(data));
            } else {
                res.status(401).json({
                    success: false,
                    reason: "need to use a proper id",
                });
            }
        }
    })
    .put("*", async (req, res) => {
        res.json({
            success: false,
        });
        //? put for auth without token to claim through network
    })
    .delete("*", async (req, res) => {
        //?
        res.json({
            success: false,
        });
    });


async function waitForResponse(socket, data) {
    return new Promise((resolve) => {
        socket.addEventListener("message", function listener(message) {
            message = JSON.parse(message.data);
            if (JSON.stringify(data) === JSON.stringify(message.original)) {
                resolve(message);
                socket.removeEventListener("message", listener);
            }
        });
    });
}
