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
const http_1 = require("../../model/http");
const Subject_1 = require("rxjs/Subject");
let RequestsRowComponent = class RequestsRowComponent {
    constructor(cd) {
        this.cd = cd;
    }
    ngOnChanges(changes) {
        var reqRes = changes.reqRes.currentValue;
        if (this._subscription) {
            this._subscription.unsubscribe;
            delete this._subscription;
        }
        this._subscription = reqRes.updated.subscribe((evt) => {
            if (evt == http_1.Update.RES_HEADERS) {
                this.cd.markForCheck();
            }
        });
    }
    get flags() {
        if (!this.reqRes) {
            return "";
        }
        var str = "";
        if (this.reqRes.isReplaced) {
            str += `<span title="Replaced: ${this.reqRes.getReqHeader("x-pro-xy-url-replace")}">&#128259;</span>`;
        }
        var delay = this.reqRes.getResHeader("x-pro-xy-delay") || this.reqRes.getReqHeader("x-pro-xy-delay");
        if (delay) {
            str += `<span title="Delayed: ${delay} ms">&#9200;</span>`;
        }
        var autoResponse = this.reqRes.getResHeader("x-pro-xy-auto-response");
        if (autoResponse) {
            str += `<span title="Auto responded: ${autoResponse}">&#128663;</span>`;
        }
        return str;
    }
};
__decorate([
    core_1.Input('request-row'),
    __metadata("design:type", http_1.ReqRes)
], RequestsRowComponent.prototype, "reqRes", void 0);
__decorate([
    core_1.Input('enabled-headers'),
    __metadata("design:type", Subject_1.Subject)
], RequestsRowComponent.prototype, "enabledHeaders", void 0);
RequestsRowComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'request-row.component.html',
        styleUrls: ['request-row.component.css'],
        selector: '[request-row]',
        changeDetection: core_1.ChangeDetectionStrategy.OnPush
    }),
    __metadata("design:paramtypes", [core_1.ChangeDetectorRef])
], RequestsRowComponent);
exports.RequestsRowComponent = RequestsRowComponent;
