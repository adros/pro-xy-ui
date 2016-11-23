import { Injectable, NgZone } from "@angular/core";
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject }    from 'rxjs/BehaviorSubject';
import { Subject }    from 'rxjs/Subject';
import * as io        from "socket.io-client";

var path = nw.require("path");
var fs = nw.require("fs");
var url = nw.require("url");

var CONFIG_LOCATION = path.join(process.env.HOME, ".pro-xyrc.json");
var DEFAULT_PORT = 8000;

@Injectable()
export class SocketService {

    socket: any

    _logsSubject: Subject<String>
    _requestsSubject: Subject<any>
    _configSubject: BehaviorSubject<any>

    constructor(private zone: NgZone) {
        this._logsSubject = new BehaviorSubject("");
        this._configSubject = new BehaviorSubject(null);
        this._requestsSubject = new BehaviorSubject(null);
        this.socket = this.connect(this.getSocketPath());
    }

    log(str) {
        this.zone.run(() => this._logsSubject.next(str));
    }

    getLogsObservable(): Observable<String> {
        return this._logsSubject;
    }

    getConfigObservable(): BehaviorSubject<any> {
        return this._configSubject;
    }

    getRequestsObservable(): Subject<any> {
        return this._requestsSubject;
    }

    connect(socketPath) {
        this.log(`Trying to connect to ${socketPath}`);
        var _socket = io.connect(socketPath, {
            reconnectionAttempts: 2,
            transports: ["websocket"]
        });

        _socket.on("connect", () => this.log(`Connected`));
        _socket.on("disconnect", (reason) => this.log(`disconnect: ${reason}`));
        _socket.on("connect_error", (err) => this.log(`connect_error: ${err}`));
        _socket.on("connect_timeout", (err) => this.log(`connect_timeout: ${err}`));
        _socket.on("reconnect_error", (err) => this.log(`reconnect_error: ${err}`));
        _socket.on("reconnecting", (err) => this.log(`reconnecting: ${err}`));
        _socket.on("reconnect_failed", (err) => {
            this.log(`reconnect_failed: ${err}`);
            this.socket = this.connect(this.getSocketPath());
        });
        _socket.on("config", (config) => {
            this.log(`New config received`);
            this.zone.run(() => this._configSubject.next(config));
        });
        _socket.on("request", (req) => {
            this.zone.run(() => this._requestsSubject.next(req));
        });

        return _socket;
    }

    getPort() {
        if (!fs.existsSync(CONFIG_LOCATION)) {
            return DEFAULT_PORT;
        }
        //not using require because JSON may have changed (and we need to read is again)
        return JSON.parse(fs.readFileSync(CONFIG_LOCATION, "utf8")).port || DEFAULT_PORT;
    }

    getSocketPath() {
        return url.format({
            hostname: "localhost",
            protocol: "http",
            port: this.getPort()
        });
    }

    updateConfig(config) {
        //will be mixin to current config in pro-xy-ws-api
        this.log(`Sending config update`);
        this.socket.emit("configupdate", config);
    }

    replaceConfig(config) {
        this.log(`Sending config replace`);
        this.socket.emit("configreplace", config);
    }
}
