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
const socket_service_1 = require("./service/socket.service");
const status_component_1 = require("./views/status/status.component");
const inspector_component_1 = require("./views/inspector/inspector.component");
const app_menu_1 = require("./_common/app-menu");
let AppComponent = class AppComponent {
    constructor(socketService, zone) {
        this.socketService = socketService;
        this.zone = zone;
        this.selectedView = "urlReplace";
        this.openAppMenu = app_menu_1.openAppMenu;
    }
    set selectedReqRes(selectedReqRes) {
        this._selectedReqRes = selectedReqRes;
        this.selectedView = "inspector";
    }
    get selectedReqRes() {
        return this._selectedReqRes;
    }
    ngOnInit() {
        this.socketService.configObservable.subscribe(config => {
            var replaces = config.urlReplace.replaces;
            var activeUrlReplaces = replaces.filter(r => !r.disabled).map(r => r.name);
            document.title = activeUrlReplaces.length ? `PRO-XY (${activeUrlReplaces.join(", ")})` : "PRO-XY";
        });
        this.registerShortcut();
    }
    toggleStatus() {
        this.status.toggle();
    }
    registerShortcut() {
        var shortcut = new nw.Shortcut({
            key: "Ctrl+R",
            active: () => this.zone.run(() => this.socketService.connectToRemote())
        });
        nw.App.registerGlobalHotKey(shortcut);
    }
};
__decorate([
    core_1.ViewChild("status"), 
    __metadata('design:type', status_component_1.StatusComponent)
], AppComponent.prototype, "status", void 0);
__decorate([
    core_1.ViewChild("inspector"), 
    __metadata('design:type', inspector_component_1.InspectorComponent)
], AppComponent.prototype, "inspector", void 0);
AppComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: "my-app",
        templateUrl: "./app.component.html",
        styleUrls: ["./app.component.css"],
        changeDetection: core_1.ChangeDetectionStrategy.OnPush
    }), 
    __metadata('design:paramtypes', [socket_service_1.SocketService, core_1.NgZone])
], AppComponent);
exports.AppComponent = AppComponent;
