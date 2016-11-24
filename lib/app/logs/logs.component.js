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
var BehaviorSubject_1 = require('rxjs/BehaviorSubject');
var path = nw.require("path");
var fs = nw.require("fs");
var readLastLines = nw.require("read-last-lines");
var LogsComponent = (function () {
    function LogsComponent(zone) {
        this.zone = zone;
        this.data = new BehaviorSubject_1.BehaviorSubject("");
        this.logLocation = path.join(process.env.HOME, "pro-xy-logs/pro-xy.log");
        this.lines = 50;
        this.interval = 3;
    }
    LogsComponent.prototype.ngOnInit = function () {
        this.readLog();
    };
    LogsComponent.prototype.readLog = function () {
        var _this = this;
        if (!fs.existsSync(this.logLocation)) {
            this.setData("Logs file '" + this.logLocation + "' not found.");
            return;
        }
        readLastLines.read(this.logLocation, this.lines)
            .then(function (lines) { return _this.setData(lines); })
            .catch(function (err) { return _this.setData("Error while loading data\r\n" + err); });
        setTimeout(function () { return _this.readLog(); }, this.interval * 1000);
    };
    LogsComponent.prototype.setData = function (data) {
        var _this = this;
        this.zone.run(function () { return _this.data.next(data); });
    };
    LogsComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            templateUrl: 'logs.component.html',
            styleUrls: ['logs.component.css'],
            selector: 'logs'
        }), 
        __metadata('design:paramtypes', [core_1.NgZone])
    ], LogsComponent);
    return LogsComponent;
}());
exports.LogsComponent = LogsComponent;
