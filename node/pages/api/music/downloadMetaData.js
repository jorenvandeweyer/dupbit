module.exports = async (req, res) => {
    const data = req.query;

    if (req.auth.isLoggedIn && data.id) {
        const id = data.id;
        res.set("Content-disposition", `attachment; filename=${id}.json`);
        res.send(JSON.stringify({
            id,
        }));
    } else {
        res.status(403).json({
            success: false,
            reason: "authentication required",
        });
    }
};
