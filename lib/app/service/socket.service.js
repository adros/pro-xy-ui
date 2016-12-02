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
var core_1 = require("@angular/core");
var Observable_1 = require('rxjs/Observable');
var ReplaySubject_1 = require('rxjs/ReplaySubject');
var config_service_1 = require('./config.service');
var io = require("socket.io-client");
var url = nw.require("url");
var Req = (function () {
    function Req() {
    }
    return Req;
}());
var Config = (function () {
    function Config() {
    }
    return Config;
}());
var SocketService = (function () {
    function SocketService(configService) {
        var _this = this;
        this.configService = configService;
        this._logsSubject = new ReplaySubject_1.ReplaySubject(20);
        var socket = this.socket = this.connect(this.getSocketPath());
        this._configSubject = Observable_1.Observable.fromEvent(socket, "config").publishBehavior(null);
        this._requestsSubject = Observable_1.Observable.fromEvent(socket, "request").publishReplay(100);
        this._connectStatusSubject = Observable_1.Observable.merge(Observable_1.Observable.fromEvent(socket, "connect", function () { return true; }), Observable_1.Observable.fromEvent(socket, "disconnect", function () { return false; })).publishBehavior(false);
        this.connectConnectables([
            this._configSubject,
            this._requestsSubject,
            this._connectStatusSubject
        ]);
        this._configSubject.subscribe(function (conf) { return conf && _this.log("new config received"); });
    }
    SocketService.prototype.connectConnectables = function (observables) {
        observables.forEach(function (c) { return c.connect(); });
    };
    SocketService.prototype.log = function (str) {
        this._logsSubject.next(str);
    };
    SocketService.prototype.getLogsObservable = function () {
        return this._logsSubject;
    };
    SocketService.prototype.getConfigObservable = function () {
        return this._configSubject;
    };
    SocketService.prototype.getRequestsObservable = function () {
        return this._requestsSubject;
    };
    SocketService.prototype.getConnectStatusObservable = function () {
        return this._connectStatusSubject;
    };
    SocketService.prototype.connect = function (socketPath) {
        var _this = this;
        this.log("trying to connect to " + socketPath);
        var _socket = io.connect(socketPath, {
            reconnectionAttempts: 2,
            transports: ["websocket"]
        });
        _socket.on("connect", function () { return _this.log("connected"); });
        _socket.on("disconnect", function (reason) { return _this.log("disconnect: " + reason); });
        _socket.on("connect_error", function (err) { return _this.log("connect_error: " + err); });
        _socket.on("connect_timeout", function (err) { return _this.log("connect_timeout: " + err); });
        _socket.on("reconnect_error", function (err) { return _this.log("reconnect_error: " + err); });
        _socket.on("reconnecting", function (err) { return _this.log("reconnecting: " + err); });
        _socket.on("reconnect_failed", function (err) {
            _this.log("reconnect_failed: " + err);
            _socket.io.uri = _this.getSocketPath();
            _this.log("trying to connect to " + _socket.io.uri);
            _socket.io.connect();
        });
        return _socket;
    };
    SocketService.prototype.getPort = function () {
        var defPort = this.configService.DEFAULT_PORT;
        try {
            return this.configService.getConfig().port || defPort;
        }
        catch (err) {
            this.log(err.message);
            return defPort;
        }
    };
    SocketService.prototype.getSocketPath = function () {
        return url.format({
            hostname: "localhost",
            protocol: "http",
            port: this.getPort()
        });
    };
    SocketService.prototype.updateConfig = function (config) {
        //will be mixin to current config in pro-xy-ws-api
        this.log("dending config update");
        this.socket.emit("configupdate", config);
    };
    SocketService.prototype.replaceConfig = function (config) {
        this.log("dending config replace");
        this.socket.emit("configreplace", config);
    };
    SocketService.prototype.sendKillSignal = function () {
        this.socket.emit("kill");
    };
    SocketService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [config_service_1.ConfigService])
    ], SocketService);
    return SocketService;
}());
exports.SocketService = SocketService;
