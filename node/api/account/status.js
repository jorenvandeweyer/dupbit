module.exports = async (req, res) => {
    res.set("Access-Control-Allow-Origin", req.get("origin") ? req.get("origin") : `chrome-extension://${req.query.origin}`);
    res.set("Access-Control-Allow-Credentials", "true");
    res.json(req.auth);
};
