import { Injectable }   from "@angular/core";
import { Observable  }          from 'rxjs/Observable';
import { BehaviorSubject }      from 'rxjs/BehaviorSubject';
import { Subject }              from 'rxjs/Subject';
import { ReplaySubject }        from 'rxjs/ReplaySubject';
import { ConnectableObservable } from 'rxjs/observable/ConnectableObservable';
import { Req, Res } from '../model/http';
import { Config }   from '../model/config';
import { ConfigService }        from './config.service';
import * as io                  from "socket.io-client";

var url = nw.require("url");

@Injectable()
export class SocketService {

    private socket: any

    logsObservable: Observable<string>
    configObservable: Observable<Config>
    connectStatusObservable: Observable<boolean>

    reqObservable: Observable<Req>
    resObservable: Observable<Res>
    reqBodyChunkObservable: Observable<any>
    resBodyChunkObservable: Observable<any>
    reqBodyEndObservable: Observable<any>
    resBodyEndObservable: Observable<any>

    constructor(private configService: ConfigService) {

        this.logsObservable = new ReplaySubject(20);

        var socket = this.socket = this.connect(this._getSocketPath());
        this.configObservable = Observable.fromEvent(socket, "config").map(c => new Config(c)).publishBehavior(new Config());
        this.reqObservable = Observable.fromEvent(socket, "request");
        this.resObservable = Observable.fromEvent(socket, "response");

        this.reqBodyChunkObservable = Observable.fromEvent(socket, "request-body-chunk");
        this.resBodyChunkObservable = Observable.fromEvent(socket, "response-body-chunk");
        this.reqBodyEndObservable = Observable.fromEvent(socket, "request-body-end");
        this.resBodyEndObservable = Observable.fromEvent(socket, "response-body-end");

        this.connectStatusObservable = Observable.merge(
            Observable.fromEvent(socket, "connect", () => true),
            Observable.fromEvent(socket, "disconnect", () => false)
        ).publishBehavior(false);

        this.connectConnectables([
            this.configObservable,
            this.connectStatusObservable
        ]);

        this.configObservable.subscribe((conf) => conf && this.log(`new config received`));
    }

    private connectConnectables(observables: any[]) {
        (<ConnectableObservable<any>[]>observables).forEach(c => c.connect());
    }

    private log(str) {
        (<Subject<string>>this.logsObservable).next(str);
    }

    private connect(socketPath) {
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
            _socket.io.uri = this._getSocketPath();
            this.log(`trying to connect to ${_socket.io.uri}`);
            _socket.io.connect();
        });

        return _socket;
    }

    private getPort() {
        var defPort = this.configService.DEFAULT_PORT;

        try {
            return this.configService.getConfig().port || defPort;
        } catch (err) {
            this.log(err.message);
            return defPort;
        }
    }

    private _getSocketPath() {
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
