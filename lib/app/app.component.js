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
var status_component_1 = require('./status/status.component');
var cp = nw.require("child_process");
var path = nw.require("path");
var fs = nw.require("fs");
var os = nw.require("os");
var PROXY_ERR_OUT_PATH = path.join(os.tmpdir(), "pro-xy-tmp-err.log");
var AppComponent = (function () {
    function AppComponent(socketService, configService) {
        this.socketService = socketService;
        this.configService = configService;
    }
    AppComponent.prototype.ngOnInit = function () {
        this.statusObservable = this.socketService.getConnectStatusObservable();
        this.socketService.getConfigObservable().subscribe(function (config) {
            var replaces = config && config['pro-xy-url-replace'] && config['pro-xy-url-replace'].replaces || [];
            var activeUrlReplaces = replaces.filter(function (r) { return !r.disabled; }).map(function (r) { return r.name; });
            document.title = activeUrlReplaces.length ? "PRO-XY (" + activeUrlReplaces.join(", ") + ")" : "PRO-XY";
        });
    };
    AppComponent.prototype.startProxy = function () {
        var _this = this;
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
            var errFileDesc = fs.openSync(PROXY_ERR_OUT_PATH, "w+");
            var proxyProcess = cp.spawn(proxyPath, [], { detached: true, stdio: ["ignore", "ignore", errFileDesc] });
            proxyProcess.unref();
            setTimeout(function () { return _this.checkErrOut(errFileDesc); }, 1000); //wait 1sec then check if theres some err out of started process
        }
        catch (e) {
            alert("Error while starting proxy: " + e.message);
        }
    };
    AppComponent.prototype.killProxy = function () {
        this.socketService.sendKillSignal();
    };
    AppComponent.prototype.toggleStatus = function () {
        this.status.toggle();
    };
    AppComponent.prototype.checkErrOut = function (fd) {
        var content = fs.readFileSync(PROXY_ERR_OUT_PATH, "utf8");
        if (!!content) {
            alert("Error while starting pro-xy: " + content);
        }
    };
    __decorate([
        core_1.ViewChild('status'), 
        __metadata('design:type', status_component_1.StatusComponent)
    ], AppComponent.prototype, "status", void 0);
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
