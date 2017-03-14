import { Component, OnInit, ViewChild, EventEmitter, Output, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { TrafficService } from '../../service/traffic.service';
import { Observable } from 'rxjs/Observable';
import { ReqRes } from '../../model/http';
import { BodyMenu } from './request.bodyMenu';
import { HeadMenu } from './request.headMenu';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

let enabledHeadersJson = localStorage.getItem("requestsComponent-enabledHeaders");
//skipping 0th (selector), defines which headers are displayed
let enabledHeaders = enabledHeadersJson && JSON.parse(enabledHeadersJson) || [true, true, true, true, true, true];

let maxRowsStr = localStorage.getItem("requestsComponent-maxRows");
let maxRows = maxRowsStr && +maxRowsStr || 50;

let replacedOnly = localStorage.getItem("requestsComponent-replacedOnly") == "true";

@Component({
    moduleId: module.id,
    templateUrl: 'requests.component.html',
    styleUrls: ['requests.component.css'],
    selector: 'requests',
    host: { class: 'flex-grow' },
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestsComponent implements OnInit {

    requestsObservable: Observable<ReqRes[]>;

    @ViewChild("tableHead") tableHead: any;

    @Output() selected = new EventEmitter<ReqRes>();
    @Output() autoResponse = new EventEmitter<ReqRes>();
    @Output() compose = new EventEmitter<ReqRes>();
    @Output() replay = new EventEmitter<ReqRes>();

    private _bodyMenu: BodyMenu
    private _headMenu: HeadMenu

    enabledHeaders = new BehaviorSubject(enabledHeaders);

    constructor(private zone: NgZone, private trafficService: TrafficService) {
        this.enabledHeaders.subscribe(enabledHeaders => localStorage.setItem("requestsComponent-enabledHeaders", JSON.stringify(enabledHeaders)));
    }

    _maxRows = maxRows
    set maxRows(maxRows) {
        this._maxRows = maxRows;
        this.trafficService.maxRows = maxRows;
        localStorage.setItem("requestsComponent-maxRows", maxRows + "");
    }
    get maxRows() { return this._maxRows; }

    _replacedOnly = replacedOnly
    set replacedOnly(replacedOnly) {
        this._replacedOnly = replacedOnly;
        this.trafficService.replacedOnly = replacedOnly;
        localStorage.setItem("requestsComponent-replacedOnly", replacedOnly + "");
    }
    get replacedOnly() { return this._replacedOnly; }

    ngOnInit(): void {
        this.trafficService.maxRows = this.maxRows;
        this.requestsObservable = this.trafficService.traffic.throttleTime(100);
        this._bodyMenu = new BodyMenu(this, this.zone);
        this._headMenu = new HeadMenu(this, this.zone);
    }

    clear() {
        this.trafficService.clear();
    }

    hBodyCtxMenu(reqRes: ReqRes, evt) {
        evt.menuItems = (evt.menuItems || []).concat(this._bodyMenu.getMenuItems(reqRes, evt));
    }

    hHeadCtxMenu(evt) {
        evt.menuItems = (evt.menuItems || []).concat(this._headMenu.getMenuItems(evt));
    }

    getColorByStatus(reqRes: ReqRes) {
        if (reqRes.statusCode >= 400) {
            return "red";
        }
    }
}
