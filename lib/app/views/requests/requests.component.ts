import { Component, OnInit, EventEmitter, Output, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { TrafficService } from '../../service/traffic.service';
import { Observable } from 'rxjs/Observable';
import {  ReqRes } from '../../model/http';

var gui = nw.require('nw.gui');
var clipboard = gui.Clipboard.get();

@Component({
    moduleId: module.id,
    templateUrl: 'requests.component.html',
    styleUrls: ['requests.component.css'],
    selector: 'requests',
    host: { class: 'flex-grow' },
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestsComponent implements OnInit {

    private menuItems: any[]
    private _miCopyReqRes: any
    private _miAutoResponse: any

    constructor(private trafficService: TrafficService, private cd: ChangeDetectorRef) {
        this._miCopyReqRes = new nw.MenuItem({ label: "Copy req & res", click: () => clipboard.set(this._lastReqRes.toString(), "text") });
        this._miAutoResponse = new nw.MenuItem({ label: "Save as auto response", click: () => this.autoResponse.emit(this._lastReqRes) });

        this.menuItems = [
            new nw.MenuItem({ label: "Copy URL", click: () => clipboard.set(this._lastReqRes.url, "text") }),
            this._miCopyReqRes,
            new nw.MenuItem({ type: "separator" }),
            this._miAutoResponse,
            new nw.MenuItem({ type: "separator" })
        ];
    }

    requestsObservable: Observable<ReqRes[]>;

    @Output()
    selected = new EventEmitter<ReqRes>();

    @Output()
    autoResponse = new EventEmitter<ReqRes>();

    _maxRows = 50
    set maxRows(maxRows) {
        this._maxRows = maxRows;
        this.trafficService.maxRows = maxRows;
    }
    get maxRows() { return this._maxRows; }

    _replacedOnly = false
    set replacedOnly(replacedOnly) {
        this._replacedOnly = replacedOnly;
        this.trafficService.replacedOnly = replacedOnly;
    }
    get replacedOnly() { return this._replacedOnly; }

    ngOnInit(): void {
        this.trafficService.maxRows = this.maxRows;
        this.requestsObservable = this.trafficService.traffic.throttleTime(100);
    }

    clear() {
        this.trafficService.clear();
    }

    _lastReqRes: ReqRes

    hCtxMenu(reqRes: ReqRes, evt) {
        this._lastReqRes = reqRes;

        this._miCopyReqRes.enabled = reqRes.isFinished;
        this._miAutoResponse.enabled = reqRes.isFinished;

        evt.menuItems = (evt.menuItems || []).concat(this.menuItems);
    }

    getColorByStatus(reqRes: ReqRes) {
        if (reqRes.statusCode >= 400) {
            return "red";
        }
    }

}
