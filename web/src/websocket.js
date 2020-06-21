import { WebSocketClient } from './websocket-request';
import WebSocketHelper from './websocket-request/src/helpers/WebSocket';
console.log(WebSocketHelper);
export default class extends WebSocketClient {
    constructor(store) {
        super();

        this.store = store;

        this._retry = 0;
        this._delays = [0, 1, 3, 5, 15, 30];


        this.on('close', () => {
            console.log('ws closed');
            this.reconnect();
        });

        this.on('open', () => {
            console.log('ws opened');
            this._retry = 0;
        });

        this.on('error', () => {
            console.log('ws error');
        });

        this.on('message', (message) => {
            console.log(message);
        });

        this.reconnect();
    }

    async reconnect() {
        if (!this.store.auth) {
            console.error('cant reconnect not authenticated');
            return;
        }

        if (this._retry > 0) {
            if (this._retry >= this._delays.length) {
                this._retry = this._delays.length - 1;
            }

            await new Promise((resolve) => {
                const delay = this._delays[this._retry];
                console.log(`waiting ${delay} before reconnect`);
                setTimeout(() => resolve(), delay * 1000);
            })
        }

        this._retry++;

        const ws = new WebSocketHelper(`${this.store.ws_host}`);
        this.attachSocket(ws);
    }
}
