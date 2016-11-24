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
var core_1 = require('@angular/core');
var socket_service_1 = require('./service/socket.service');
var config_service_1 = require('./service/config.service');
var cp = nw.require("child_process");
var path = nw.require("path");
var AppComponent = (function () {
    function AppComponent(socketService, configService) {
        this.socketService = socketService;
        this.configService = configService;
    }
    AppComponent.prototype.ngOnInit = function () {
        this.statusObservable = this.socketService.getConnectStatusObservable();
    };
    AppComponent.prototype.startProxy = function () {
        try {
            var cs = this.configService;
            if (!cs.configExists()) {
                var create = confirm("Config does not exists. Create default config?");
                if (!create) {
                    return;
                }
                cs.createDefaultConfig();
            }
            var config = cs.getConfig();
            if (!~config.plugins.indexOf("pro-xy-ws-api")) {
                throw new Error("Config does not contain 'pro-xy-ws-api' plugin which is needed for pro-xy-ui. Not starting pro-xy.");
            }
            var proxyPath = path.resolve(path.dirname(process.mainModule.filename), "./node_modules/.bin/pro-xy");
            var proxyProcess = cp.spawn(proxyPath, [], { detached: true, stdio: 'ignore' });
            proxyProcess.unref();
            console.log("PID", proxyProcess.pid);
        }
        catch (e) {
            alert("Error while starting proxy: " + e.message);
        }
    };
    AppComponent.prototype.killProxy = function () {
        this.socketService.sendKillSignal();
    };
    AppComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'my-app',
            templateUrl: './app.component.html',
            styleUrls: ['./app.component.css']
        }), 
        __metadata('design:paramtypes', [socket_service_1.SocketService, config_service_1.ConfigService])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
