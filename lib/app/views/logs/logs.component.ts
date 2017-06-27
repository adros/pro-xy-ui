import { Component, OnInit, NgZone, ChangeDetectionStrategy} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
var path = nw.require("path");
var fs = nw.require("fs");
var {exec} = nw.require("child_process");

@Component({
    moduleId: module.id,
    templateUrl: 'logs.component.html',
    styleUrls: ['logs.component.css'],
    selector: 'logs',
    host: { class: 'flex-grow' },
    changeDetection: ChangeDetectionStrategy.OnPush
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
            //TODO: windows (no tail equivalent, use IF(WIN ) & previous version of this code (3rd party module))
            exec(`tail -${this.lines || 100} ${this.logLocation}`, (error, stdout, stderr) => {
                let data = error ? `Error while loading data\r\n${error.message}\r\n${stderr}` : stdout;
                this.setData(data)
            });
        }
        let interval = this.interval <= 0 ? 3 : this.interval;
        setTimeout(() => this.readLog(), interval * 1000);
    }

    setData(data) {
        this.zone.run(() => this.data.next(data));
    }
}
