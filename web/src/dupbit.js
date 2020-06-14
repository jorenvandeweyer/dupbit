console.log('module', typeof module);
console.log('document', typeof document);
console.log('navigator', typeof navigator);

const env = {
    host: 'dev.dupbit.com',
    user_agent: 'api-lib',
    version: '0.0.1',
    delays: [0, 1, 5, 15, 30, 60, 180, 240],

};

class EventEmitter {
    constructor() {
        this._listeners = new Map();
    }
    emit(type, message) {
        if (!this._listeners.has(type)) return;
        this._listeners.get(type).forEach(listener => listener(message));
    }
    on(type, listener) {
        if (!this._listeners.has(type)) 
            this._listeners.set(type, new Array());
        this._listeners.get(type).push(listener);
    }
    removeListener(type, listener) {
        if (!this._listeners.has(type)) return;
        const listeners = this._listeners.get(type);
        listeners.splice(listeners.indexOf(listener), 1);
    }
    removeAllListenersOf(type) {
        if (!this._listeners.has(type)) return;
        this._listeners.remove(type);
    }
    removeAllListeners() {
        this._listeners.clear();
    }
}

class Dupbit_API extends EventEmitter {
    static setEnv(_env) {
        Object.assign(env, _env);
    }

    static async login(username, password) {
        const result = await request({
            path: '/account/login',
            method: 'POST',
            body: {
                username,
                password,
            },
        });
        return result;
    }

    static async register(username, password, email) {
        const result = await request({
            path: '/account',
            method: 'POST',
            body: {
                username,
                password,
                email
            },
        });
        return result;
    }

    constructor(options={}) {
        super();

        //these get assigned by options var
        this.socket = false; //default false
        this.token = null; //default null
        this.debug = true; //default false
        this.browser = false;

        //these get assigned by env var
        this.host = undefined;
        this.delays = undefined;

        Object.assign(this, env);
        Object.assign(this, options);

        this.delay = 0;
        this.retry = true;
        this.ready = false;

        this._ws = null;

        if (this.token || this.browser) {
            this._connect();
        }
    }

    async login(username, password) {
        this.delay = 0;
        const result = await Dupbit_API.login(username, password);
        if (result && result.success) {
            if (!this.browser) this.token = result.string;
            await this.reconnect();
            this.emit(Dupbit_API.event.LOGIN);
        }
        return result;
    }

    async logout() {
        const result = await request({
            path: '/account/login',
            method: 'POST',
        });
        return result;
    }

    register(...args) {
        return Dupbit_API.register(...args);
    }

    async reconnect() {
        this.retry = true;
        this.delay = 0;
        return this._connect();
    }

    async disconnect() {
        if (!this._ws) return;
        this.retry = false;
        this._ws.close();
    }

    async call(body, options) {
        if (!this.authenticated) 
            return this.emit(Dupbit_API.event.ERROR, Dupbit_API.error.NOT_CONNECTED);

        return request({
            token: this.token,
            path: '/account',
            body,
            method: 'POST',
            ...options,
        });
    }

    async _connect() {
        await this._validate();

        if (!this.auth && !this.token) {
            if (this.debug) console.log('can\'t connect invalid credentials');
            this.emit(Dupbit_API.event.ERROR, Dupbit_API.error.INVALID_CREDENTIALS);
            return;
        }

        if (!this.auth && !this.retry) {
            if (this.debug) console.log('not trying/retrying to connect');
            return;
        }

        if (!this.auth) {
            const delay = this.delays[this.delay];
            this.delay++;
            if (this.delay >= this.delays.length) this.delay = this.delays.length-1;

            if (this.debug) console.log(`reconnecting in ${delay} seconds`);
            this.emit(Dupbit_API.event.RECONNECTING, delay);

            setTimeout(() => { this._connect();}, delay*1000);
            return;
        }

        if (this.socket && !this._ws) {
            this._connectSocket();
            return;
        }

        if (!this.ready) {
            this.ready = true;
            this.emit(Dupbit_API.event.READY);
            return;
        }
    }

    async _validate() {
        try {
            const auth = await request({
                path: '/account',
                method: 'GET',
                token: this.token,
                host: this.host,
            });

            if (auth && auth.success) {
                this.auth = auth;
            } else {
                this.auth = false;
                this.token = null;
            }
        } catch (e) {
            this.auth = null;
        }
    }

    get authenticated() {
        return !!this.auth;
    }

    get connected() {
        return !!this._ws;
    }

    static get error() {
        return {
            'SOCKET_ERROR': 'socket_error',
            'INVALID_CREDENTIALS': 'invalid_credentials',
            'NOT_CONNECTED': 'not_connected',
        };
    }

    static get event() {
        return {
            'READY': 'ready',
            'MESSAGE': 'message',
            'LOGIN': 'login',
            'LOGOUT': 'logout',
            'CONNECTED': 'connected',
            'DISCONNECTED': 'disconnected',
            'RECONNECTING': 'reconnecting',
            'ERROR': 'error',
        };
    }
}

async function request(options) {
    const result = await fetch(`https://api.${env.host}${options.path}`, {
        credentials: 'include',
        method: options.method,
        headers: {
            'Content-Type': 'application/json',
            'authorization': options.token ? options.token : '',
        },
        body: (options.body ? JSON.stringify(options.body) : undefined),
    }).then((res) => {
        if (res.headers.get('content-type') && 
            res.headers.get('content-type').includes('json')) 
        {
            return res.json();
        } else {
            return res.text();
        }
    });

    return result;
}

export default Dupbit_API;

