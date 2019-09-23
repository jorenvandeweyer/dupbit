const db = require('../api/src/database');

module.exports = () => {
    db.close();
};
