"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
const core_1 = require("@angular/core");
const Observable_1 = require('rxjs/Observable');
const ReplaySubject_1 = require('rxjs/ReplaySubject');
const http_1 = require('../model/http');
const config_1 = require('../model/config');
const config_service_1 = require('./config.service');
const io = require("socket.io-client");
var url = nw.require("url");
let SocketService = class SocketService {
    constructor(configService, zone) {
        this.configService = configService;
        this.zone = zone;
        this._logsSubject = new ReplaySubject_1.ReplaySubject(20);
        var socket = this.socket = this.connect(this.getSocketPath());
        this._configSubject = Observable_1.Observable.fromEvent(socket, "config").map(config_1.fromObject).publishBehavior(config_1.fromObject({}));
        this._reqSubject = Observable_1.Observable.fromEvent(socket, "request").map(http_1.toReq).publishReplay(100);
        this._resSubject = Observable_1.Observable.fromEvent(socket, "response").map(http_1.toRes).publishReplay(100);
        this._connectStatusSubject = Observable_1.Observable.merge(Observable_1.Observable.fromEvent(socket, "connect", () => true), Observable_1.Observable.fromEvent(socket, "disconnect", () => false)).publishBehavior(false);
        this.connectConnectables([
            this._configSubject,
            this._reqSubject,
            this._resSubject,
            this._connectStatusSubject
        ]);
        this._configSubject.subscribe((conf) => conf && this.log(`new config received`));
        this.registerShortcut();
    }
    connectConnectables(observables) {
        observables.forEach(c => c.connect());
    }
    log(str) {
        this._logsSubject.next(str);
    }
    getLogsObservable() {
        return this._logsSubject;
    }
    getConfigObservable() {
        return this._configSubject;
    }
    getRequestsObservable() {
        return this._reqSubject;
    }
    getResponseObservable() {
        return this._resSubject;
    }
    getConnectStatusObservable() {
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
        }
        catch (err) {
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
        if (!path) {
            return;
        }
        this.socket.io.close();
        this.socket.io.uri = path;
        this.socket.io.skipReconnect = false;
        this.log(`trying to connect to ${path}`);
        this.socket.io.reconnect();
    }
};
SocketService = __decorate([
    core_1.Injectable(), 
    __metadata('design:paramtypes', [config_service_1.ConfigService, core_1.NgZone])
], SocketService);
exports.SocketService = SocketService;
