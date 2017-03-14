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
const http_1 = require("@angular/http");
const socket_service_1 = require("./service/socket.service");
const status_component_1 = require("./views/status/status.component");
const inspector_component_1 = require("./views/inspector/inspector.component");
const app_menu_1 = require("./_common/app-menu");
const patchResize_1 = require("./_common/patchResize");
const material_1 = require("@angular/material");
var semver = nw.require("semver");
let AppComponent = class AppComponent {
    constructor(socketService, zone, http, snackBar) {
        this.socketService = socketService;
        this.zone = zone;
        this.http = http;
        this.snackBar = snackBar;
        this._selectedView = "urlReplace";
        this.openAppMenu = app_menu_1.openAppMenu;
    }
    set selectedReqRes(selectedReqRes) {
        this._selectedReqRes = selectedReqRes;
        this.selectedView = "inspector";
    }
    get selectedReqRes() {
        return this._selectedReqRes;
    }
    set selectedView(selectedView) {
        this._selectedView = selectedView;
    }
    get selectedView() {
        return this._selectedView;
    }
    ngOnInit() {
        this.socketService.configObservable.subscribe(config => {
            var replaces = config.urlReplace.replaces;
            var activeUrlReplaces = replaces.filter(r => !r.disabled).map(r => r.name);
            document.title = activeUrlReplaces.length ? `PRO-XY UI (${activeUrlReplaces.join(", ")})` : "PRO-XY UI";
        });
        this.checkVersion();
        this.statusObservable = this.socketService.connectStatusObservable;
        this.statusObservable.subscribe(connected => !connected && (this.selectedView = "logs"));
        var width = localStorage.getItem("leftSectionWidth");
        this.leftSection.nativeElement.style.width = width ? width + "px" : "50%";
        patchResize_1.patchResize(this.leftSection.nativeElement, size => localStorage.setItem("leftSectionWidth", size.w));
    }
    toggleStatus() {
        this.status.toggle();
    }
    checkVersion() {
        this.http.get("http://registry.npmjs.org/pro-xy-ui?cacheBust=" + Math.random())
            .toPromise()
            .then(response => {
            var currentVersion = nw.require("nw.gui").App.manifest.version;
            var latestVersion = response.json()["dist-tags"].latest;
            if (!semver.gt(latestVersion, currentVersion)) {
                return;
            }
            var ref = this.snackBar.open(`New version availible ${latestVersion} (current version ${currentVersion})`, "More info", {
                duration: 4000,
            });
            ref.onAction().subscribe(() => alert(`Suggested steps for update:
                  1. stop pro-xy process if running (click 'Kill pro-xy' button)
                  2. stop pro-xy-ui application
                  3. install new version of pro-xy-ui
                      [sudo] npm install -g pro-xy-ui
                  4. start pro-xy-ui & pro-xy`));
        })
            .catch(err => console.error("Error while geting lates version", err));
    }
    reload() {
        chrome.runtime.reload();
    }
};
__decorate([
    core_1.ViewChild("status"),
    __metadata("design:type", status_component_1.StatusComponent)
], AppComponent.prototype, "status", void 0);
__decorate([
    core_1.ViewChild("inspector"),
    __metadata("design:type", inspector_component_1.InspectorComponent)
], AppComponent.prototype, "inspector", void 0);
__decorate([
    core_1.ViewChild("autoResponder"),
    __metadata("design:type", Object)
], AppComponent.prototype, "autoResponder", void 0);
__decorate([
    core_1.ViewChild("connection"),
    __metadata("design:type", Object)
], AppComponent.prototype, "connection", void 0);
__decorate([
    core_1.ViewChild("composer"),
    __metadata("design:type", Object)
], AppComponent.prototype, "composer", void 0);
__decorate([
    core_1.ViewChild("leftSection"),
    __metadata("design:type", Object)
], AppComponent.prototype, "leftSection", void 0);
AppComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: "my-app",
        templateUrl: "./app.component.html",
        styleUrls: ["./app.component.css"],
        changeDetection: core_1.ChangeDetectionStrategy.OnPush
    }),
    __metadata("design:paramtypes", [socket_service_1.SocketService, core_1.NgZone, http_1.Http, material_1.MdSnackBar])
], AppComponent);
exports.AppComponent = AppComponent;
