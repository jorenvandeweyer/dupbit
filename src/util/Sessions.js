const Session = require("./resources/Session");

// Make a login session for the given id
function login($uid) {
    session_start();
    $_SESSION["login"] = $uid;
    session_write_close();
}

class Sessions {
    constructor() {
        this.sessions = new Map();
    }

    login(uid, data) {
        let session = new Session(uid, data);
        this.sessions.set(session.sid, session);
    }

    isLoggedIn(cookies) {
        if ("sid" in cookies && this.sessions.has(cookies["sid"])) {
            return true;
        } else {
            return false;
        }
    }

    getLogin(cookies) {
        if (this.isLoggedIn(cookies)) {
            return this.sessions.get(cookies["sid"]);
        } else {
            return null;
        }
    }

}
