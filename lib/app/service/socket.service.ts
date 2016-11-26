import { Injectable, NgZone }   from "@angular/core";
import { Observable  }          from 'rxjs/Observable';
import { BehaviorSubject }      from 'rxjs/BehaviorSubject';
import { Subject }              from 'rxjs/Subject';
import { ReplaySubject }        from 'rxjs/ReplaySubject';
import { ConnectableObservable } from 'rxjs/observable/ConnectableObservable';
import { ConfigService }        from './config.service';
import * as io                  from "socket.io-client";

var url = nw.require("url");


class Req { url: string; origUrl: string; method: string }
class Config { [key: string]: any; }

@Injectable()
export class SocketService {

    socket: any

    _logsSubject: Subject<string>
    _requestsSubject: Observable<Req>
    _configSubject: BehaviorSubject<Config>
    _connectStatusSubject: BehaviorSubject<boolean>

    constructor(private zone: NgZone, private configService: ConfigService/*, private app: ApplicationRef*/) {

        this._logsSubject = new ReplaySubject(20);
        this._configSubject = new BehaviorSubject(null);
        // this._requestsSubject = new ReplaySubject(100);
        this._connectStatusSubject = new BehaviorSubject(false);

        var socket = this.socket = this.connect(this.getSocketPath());

        this._requestsSubject = Observable.fromEvent(socket, "request")
            .publishReplay(100);
        (<ConnectableObservable<Req>>this._requestsSubject).connect();
    }

    log(str) {
        this.zone.run(() => this._logsSubject.next(str));
    }

    getLogsObservable(): Observable<string> {
        return this._logsSubject;
    }

    getConfigObservable(): BehaviorSubject<Config> {
        return this._configSubject;
    }

    getRequestsObservable(): Observable<Req> {
        return this._requestsSubject;
    }

    getConnectStatusObservable(): Observable<boolean> {
        return this._connectStatusSubject;
    }

    connect(socketPath) {
        this.log(`Trying to connect to ${socketPath}`);
        var _socket = io.connect(socketPath, {
            reconnectionAttempts: 2,
            transports: ["websocket"]
        });

        _socket.on("connect", () => {
            this.updateConnectStatus(true);
            this.log(`Connected`)
        });
        _socket.on("disconnect", (reason) => {
            this.updateConnectStatus(false);
            this.log(`disconnect: ${reason}`);
        });
        _socket.on("connect_error", (err) => this.log(`connect_error: ${err}`));
        _socket.on("connect_timeout", (err) => this.log(`connect_timeout: ${err}`));
        _socket.on("reconnect_error", (err) => this.log(`reconnect_error: ${err}`));
        _socket.on("reconnecting", (err) => this.log(`reconnecting: ${err}`));
        _socket.on("reconnect_failed", (err) => {
            this.log(`reconnect_failed: ${err}`);
            _socket.io.uri = this.getSocketPath();
            this.log(`Trying to connect to ${_socket.io.uri}`);
            _socket.io.connect();
        });
        _socket.on("config", (config) => {
            this.log(`New config received`);
            this.zone.run(() => this._configSubject.next(config));
        });
        // _socket.on("request", (req) => {
        //     this.zone.run(() => this._requestsSubject.next(req));
        // });

        return _socket;
    }

    updateConnectStatus(connected) {
        this.zone.run(() => this._connectStatusSubject.next(connected));
    }

    getPort() {
        var defPort = this.configService.DEFAULT_PORT;

        try {
            return this.configService.getConfig().port || defPort;
        } catch (err) {
            this.log(err.message);
            return defPort;
        }
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

    sendKillSignal() {
        this.socket.emit("kill");
    }
}
