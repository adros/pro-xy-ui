import { Injectable, NgZone }   from "@angular/core";
import { Observable  }          from 'rxjs/Observable';
import { BehaviorSubject }      from 'rxjs/BehaviorSubject';
import { Subject }              from 'rxjs/Subject';
import { ReplaySubject }        from 'rxjs/ReplaySubject';
import { ConnectableObservable } from 'rxjs/observable/ConnectableObservable';
import { Req, Res, toReq, toRes } from '../model/http';
import { Config, fromObject }   from '../model/config';
import { ConfigService }        from './config.service';
import * as io                  from "socket.io-client";

var url = nw.require("url");

@Injectable()
export class SocketService {

    socket: any

    _logsSubject: Subject<string>
    _reqSubject: Observable<Req>
    _resSubject: Observable<Res>
    _configSubject: Observable<Config>
    _connectStatusSubject: Observable<boolean>

    constructor(private configService: ConfigService, private zone: NgZone) {

        this._logsSubject = new ReplaySubject(20);

        var socket = this.socket = this.connect(this.getSocketPath());
        this._configSubject = Observable.fromEvent(socket, "config").map(fromObject).publishBehavior(fromObject({}));
        this._reqSubject = Observable.fromEvent(socket, "request").map(toReq).publishReplay(100);
        this._resSubject = Observable.fromEvent(socket, "response").map(toRes).publishReplay(100);

        this._connectStatusSubject = Observable.merge(
            Observable.fromEvent(socket, "connect", () => true),
            Observable.fromEvent(socket, "disconnect", () => false)
        ).publishBehavior(false);

        this.connectConnectables([
            this._configSubject,
            this._reqSubject,
            this._resSubject,
            this._connectStatusSubject
        ]);

        this._configSubject.subscribe((conf) => conf && this.log(`new config received`));

        this.registerShortcut();
    }

    connectConnectables(observables: any[]) {
        (<ConnectableObservable<any>[]>observables).forEach(c => c.connect());
    }

    log(str) {
        this._logsSubject.next(str);
    }

    getLogsObservable(): Observable<string> {
        return this._logsSubject;
    }

    getConfigObservable(): Observable<Config> {
        return this._configSubject;
    }

    getRequestsObservable(): Observable<Req> {
        return this._reqSubject;
    }

    getResponseObservable(): Observable<Res> {
        return this._resSubject;
    }

    getConnectStatusObservable(): Observable<boolean> {
        return this._connectStatusSubject;
    }

    connect(socketPath) {
        this.log(`trying to connect to ${socketPath}`);
        var _socket = io.connect(socketPath, {
            reconnectionAttempts: 2,
            transports: ["websocket"]
        });

        _socket.on("connect", () => this.log(`connected`));
        _socket.on("disconnect", (reason) => this.log(`disconnect: ${reason}`));
        _socket.on("connect_error", (err) => this.log(`connect_error: ${err}`));
        _socket.on("connect_timeout", (err) => this.log(`connect_timeout: ${err}`));
        _socket.on("reconnect_error", (err) => this.log(`reconnect_error: ${err}`));
        _socket.on("reconnecting", (err) => this.log(`reconnecting: ${err}`));
        _socket.on("reconnect_failed", (err) => {
            this.log(`reconnect_failed: ${err}`);
            _socket.io.uri = this.getSocketPath();
            this.log(`trying to connect to ${_socket.io.uri}`);
            _socket.io.connect();
        });

        return _socket;
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
        this.log(`sendending config update`);
        this.socket.emit("configupdate", config);
    }

    replaceConfig(config) {
        this.log(`sendending config replace`);
        this.socket.emit("configreplace", config);
    }

    sendKillSignal() {
        this.socket.emit("kill");
    }

    registerShortcut() {
        var shortcut = new nw.Shortcut({
            key: "Ctrl+R",
            active: () => this.zone.run(() => this.connectToRemote())
        });
        nw.App.registerGlobalHotKey(shortcut);
    }

    connectToRemote() {
        var path = prompt("Remote path (e.g. http://server:8000)");
        if (!path) { return; }
        this.socket.io.close();
        this.socket.io.uri = path;
        this.socket.io.skipReconnect = false;
        this.log(`trying to connect to ${path}`);
        this.socket.io.reconnect();
    }
}
