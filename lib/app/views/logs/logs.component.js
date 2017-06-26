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
const BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var path = nw.require("path");
var fs = nw.require("fs");
var { exec } = nw.require("child_process");
let LogsComponent = class LogsComponent {
    constructor(zone) {
        this.zone = zone;
        this.data = new BehaviorSubject_1.BehaviorSubject("");
        this.logLocation = path.join(process.env.HOME, "pro-xy-logs/pro-xy.log");
        this.lines = 100;
        this.interval = 3;
    }
    ngOnInit() {
        this.readLog();
    }
    readLog() {
        if (!fs.existsSync(this.logLocation)) {
            this.setData(`Logs file '${this.logLocation}' not found.`);
        }
        else {
            exec(`tail -${this.lines || 100} ${this.logLocation}`, (error, stdout, stderr) => {
                let data = error ? `Error while loading data\r\n${error.message}\r\n${stderr}` : stdout;
                this.setData(data);
            });
        }
        let interval = this.interval <= 0 ? 3 : this.interval;
        setTimeout(() => this.readLog(), interval * 1000);
    }
    setData(data) {
        this.zone.run(() => this.data.next(data));
    }
};
LogsComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'logs.component.html',
        styleUrls: ['logs.component.css'],
        selector: 'logs',
        host: { class: 'flex-grow' },
        changeDetection: core_1.ChangeDetectionStrategy.OnPush
    }),
    __metadata("design:paramtypes", [core_1.NgZone])
], LogsComponent);
exports.LogsComponent = LogsComponent;
