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
const traffic_service_1 = require("../../service/traffic.service");
const request_bodyMenu_1 = require("./request.bodyMenu");
const request_headMenu_1 = require("./request.headMenu");
const BehaviorSubject_1 = require("rxjs/BehaviorSubject");
let RequestsComponent = class RequestsComponent {
    constructor(zone, trafficService) {
        this.zone = zone;
        this.trafficService = trafficService;
        this.selected = new core_1.EventEmitter();
        this.autoResponse = new core_1.EventEmitter();
        this.compose = new core_1.EventEmitter();
        this.replay = new core_1.EventEmitter();
        //skipping 0th (selector), defines which headers are displayed
        this.enabledHeaders = new BehaviorSubject_1.BehaviorSubject([true, true, true, true, true, true]);
        this._maxRows = 50;
        this._replacedOnly = false;
    }
    set maxRows(maxRows) {
        this._maxRows = maxRows;
        this.trafficService.maxRows = maxRows;
    }
    get maxRows() { return this._maxRows; }
    set replacedOnly(replacedOnly) {
        this._replacedOnly = replacedOnly;
        this.trafficService.replacedOnly = replacedOnly;
    }
    get replacedOnly() { return this._replacedOnly; }
    ngOnInit() {
        this.trafficService.maxRows = this.maxRows;
        this.requestsObservable = this.trafficService.traffic.throttleTime(100);
        this._bodyMenu = new request_bodyMenu_1.BodyMenu(this, this.zone);
        this._headMenu = new request_headMenu_1.HeadMenu(this, this.zone);
    }
    clear() {
        this.trafficService.clear();
    }
    hBodyCtxMenu(reqRes, evt) {
        evt.menuItems = (evt.menuItems || []).concat(this._bodyMenu.getMenuItems(reqRes, evt));
    }
    hHeadCtxMenu(evt) {
        evt.menuItems = (evt.menuItems || []).concat(this._headMenu.getMenuItems(evt));
    }
    getColorByStatus(reqRes) {
        if (reqRes.statusCode >= 400) {
            return "red";
        }
    }
};
__decorate([
    core_1.ViewChild("tableHead"),
    __metadata("design:type", Object)
], RequestsComponent.prototype, "tableHead", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], RequestsComponent.prototype, "selected", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], RequestsComponent.prototype, "autoResponse", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], RequestsComponent.prototype, "compose", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], RequestsComponent.prototype, "replay", void 0);
RequestsComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'requests.component.html',
        styleUrls: ['requests.component.css'],
        selector: 'requests',
        host: { class: 'flex-grow' },
        changeDetection: core_1.ChangeDetectionStrategy.OnPush
    }),
    __metadata("design:paramtypes", [core_1.NgZone, traffic_service_1.TrafficService])
], RequestsComponent);
exports.RequestsComponent = RequestsComponent;
