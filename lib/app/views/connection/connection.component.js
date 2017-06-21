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
const socket_service_1 = require("../../service/socket.service");
const config_service_1 = require("../../service/config.service");
var cp = nodeRequire("child_process");
var path = nodeRequire("path");
var fs = nodeRequire("fs");
var os = nodeRequire("os");
const { session: { defaultSession: session } } = nodeRequire('electron').remote;
var PROXY_ERR_OUT_PATH = path.join(os.tmpdir(), "pro-xy-tmp-err.log");
let ConnectionComponent = class ConnectionComponent {
    constructor(socketService, configService) {
        this.socketService = socketService;
        this.configService = configService;
    }
    ngOnInit() {
        this.statusObservable = this.socketService.connectStatusObservable;
        this.socketService.configObservable.subscribe(config => {
            var replaces = config.urlReplace.replaces;
            var activeUrlReplaces = replaces.filter(r => !r.disabled).map(r => r.name);
            document.title = activeUrlReplaces.length ? `PRO-XY UI (${activeUrlReplaces.join(", ")})` : "PRO-XY UI";
        });
    }
    startProxy() {
        //TODO: this should be not needed if proxy is configured correctly
        session.setProxy({ proxyRules: "" }, () => 1);
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
            if (/^win/.test(process.platform)) {
                proxyPath += ".cmd";
            }
            var errFileDesc = fs.openSync(PROXY_ERR_OUT_PATH, "w+");
            var proxyProcess = cp.spawn(proxyPath, [], { detached: true, stdio: ["ignore", "ignore", errFileDesc] });
            proxyProcess.unref();
            setTimeout(() => this.checkErrOut(errFileDesc), 1000); //wait 1sec then check if theres some err out of started process
        }
        catch (e) {
            alert(`Error while starting proxy: ${e.message}`);
        }
    }
    killProxy() {
        this.socketService.sendKillSignal();
    }
    checkErrOut(fd) {
        var content = fs.readFileSync(PROXY_ERR_OUT_PATH, "utf8");
        if (!!content) {
            alert("Error while starting pro-xy: " + content);
        }
    }
    restart() {
        this.socketService.sendKillSignal();
        setTimeout(() => { this.startProxy(); }, 500); //wait little bit
    }
};
ConnectionComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'connection.component.html',
        styleUrls: ['connection.component.css'],
        selector: 'connection',
        changeDetection: core_1.ChangeDetectionStrategy.OnPush
    }),
    __metadata("design:paramtypes", [socket_service_1.SocketService, config_service_1.ConfigService])
], ConnectionComponent);
exports.ConnectionComponent = ConnectionComponent;
