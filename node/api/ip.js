module.exports = async (req, res) => {
    res.send(req.get("x-real-ip"));
};
