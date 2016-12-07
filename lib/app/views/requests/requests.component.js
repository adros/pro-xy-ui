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
const core_1 = require('@angular/core');
const traffic_service_1 = require('../../service/traffic.service');
let RequestsComponent = class RequestsComponent {
    constructor(trafficService) {
        this.trafficService = trafficService;
        this.selected = new core_1.EventEmitter();
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
        this.requestsObservable = this.trafficService.traffic;
        // .filter(reqRes => !this.replacedOnly || !!reqRes. origUrl)
        // .scan((arr, req) => {
        //     arr.push(req);
        //     return arr.slice(-1 * this.maxRows);
        // }, []);
    }
    clear() {
        this.trafficService.clear();
    }
};
__decorate([
    core_1.Output(), 
    __metadata('design:type', Object)
], RequestsComponent.prototype, "selected", void 0);
RequestsComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'requests.component.html',
        styleUrls: ['requests.component.css'],
        selector: 'requests',
        host: { class: 'flex-grow' }
    }), 
    __metadata('design:paramtypes', [traffic_service_1.TrafficService])
], RequestsComponent);
exports.RequestsComponent = RequestsComponent;
