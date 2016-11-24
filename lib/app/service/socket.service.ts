import { Injectable, NgZone } from "@angular/core";
import { Observable  } from 'rxjs/Observable';
import {  BehaviorSubject, } from 'rxjs/BehaviorSubject';
import {  Subject } from 'rxjs/Subject';
import {  ReplaySubject } from 'rxjs/ReplaySubject';
import {  ConfigService } from './config.service';

import * as io from "socket.io-client";

var url = nw.require("url");

@Injectable()
export class SocketService {

    socket: any

    _logsSubject: Subject<String>
    _requestsSubject: ReplaySubject<any>
    _configSubject: BehaviorSubject<any>
    _connectStatusSubject: BehaviorSubject<any>

    constructor(private zone: NgZone, private configService: ConfigService) {
        this._logsSubject = new BehaviorSubject("");
        this._configSubject = new BehaviorSubject(null);
        this._requestsSubject = new ReplaySubject(20);
        this._connectStatusSubject = new BehaviorSubject(false);

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

    getRequestsObservable(): Observable<any> {
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
