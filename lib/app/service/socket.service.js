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
var BehaviorSubject_1 = require('rxjs/BehaviorSubject');
var io = require("socket.io-client");
var path = nw.require("path");
var fs = nw.require("fs");
var url = nw.require("url");
var CONFIG_LOCATION = path.join(process.env.HOME, ".pro-xyrc.json");
var DEFAULT_PORT = 8000;
var SocketService = (function () {
    function SocketService(zone) {
        this.zone = zone;
        this._logsSubject = new BehaviorSubject_1.BehaviorSubject("");
        this._configSubject = new BehaviorSubject_1.BehaviorSubject(null);
        this._requestsSubject = new BehaviorSubject_1.BehaviorSubject(null);
        this.socket = this.connect(this.getSocketPath());
    }
    SocketService.prototype.log = function (str) {
        var _this = this;
        this.zone.run(function () { return _this._logsSubject.next(str); });
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
    SocketService.prototype.connect = function (socketPath) {
        var _this = this;
        this.log("Trying to connect to " + socketPath);
        var _socket = io.connect(socketPath, {
            reconnectionAttempts: 2,
            transports: ["websocket"]
        });
        _socket.on("connect", function () { return _this.log("Connected"); });
        _socket.on("disconnect", function (reason) { return _this.log("disconnect: " + reason); });
        _socket.on("connect_error", function (err) { return _this.log("connect_error: " + err); });
        _socket.on("connect_timeout", function (err) { return _this.log("connect_timeout: " + err); });
        _socket.on("reconnect_error", function (err) { return _this.log("reconnect_error: " + err); });
        _socket.on("reconnecting", function (err) { return _this.log("reconnecting: " + err); });
        _socket.on("reconnect_failed", function (err) {
            _this.log("reconnect_failed: " + err);
            _this.socket = _this.connect(_this.getSocketPath());
        });
        _socket.on("config", function (config) {
            _this.log("New config received");
            _this.zone.run(function () { return _this._configSubject.next(config); });
        });
        _socket.on("request", function (req) {
            _this.zone.run(function () { return _this._requestsSubject.next(req); });
        });
        return _socket;
    };
    SocketService.prototype.getPort = function () {
        if (!fs.existsSync(CONFIG_LOCATION)) {
            return DEFAULT_PORT;
        }
        //not using require because JSON may have changed (and we need to read is again)
        return JSON.parse(fs.readFileSync(CONFIG_LOCATION, "utf8")).port || DEFAULT_PORT;
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
        this.log("Sending config update");
        this.socket.emit("configupdate", config);
    };
    SocketService.prototype.replaceConfig = function (config) {
        this.log("Sending config replace");
        this.socket.emit("configreplace", config);
    };
    SocketService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [core_1.NgZone])
    ], SocketService);
    return SocketService;
}());
exports.SocketService = SocketService;
