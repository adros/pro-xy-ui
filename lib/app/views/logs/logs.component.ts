import { Component, OnInit, NgZone } from '@angular/core';
import {  BehaviorSubject, } from 'rxjs/BehaviorSubject';
var path = nw.require("path");
var fs = nw.require("fs");
var readLastLines = nw.require("read-last-lines");

@Component({
    moduleId: module.id,
    templateUrl: 'logs.component.html',
    styleUrls: ['logs.component.css'],
    selector: 'logs',
    host: { class: 'flex-grow' }
})
export class LogsComponent implements OnInit {

    data = new BehaviorSubject<String>("")
    logLocation = path.join(process.env.HOME, "pro-xy-logs/pro-xy.log")

    constructor(private zone: NgZone) { }

    lines = 100
    interval = 3

    ngOnInit(): void {
        this.readLog();
    }

    readLog() {
        if (!fs.existsSync(this.logLocation)) {
            this.setData(`Logs file '${this.logLocation}' not found.`);
        } else {
            readLastLines.read(this.logLocation, this.lines)
                .then(lines => this.setData(lines))
                .catch(err => this.setData(`Error while loading data\r\n${err}`));
        }
        setTimeout(() => this.readLog(), this.interval * 1000);
    }

    setData(data) {
        this.zone.run(() => this.data.next(data));
    }
}
