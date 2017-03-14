import { Component, OnChanges, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ReqRes, Update } from '../../model/http';
import { Subject }              from 'rxjs/Subject';

@Component({
    moduleId: module.id,
    templateUrl: 'request-row.component.html',
    styleUrls: ['request-row.component.css'],
    selector: '[request-row]',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestsRowComponent implements OnChanges {

    constructor(private cd: ChangeDetectorRef) { }

    @Input('request-row')
    reqRes: ReqRes;

    @Input('enabled-headers')
    enabledHeaders: Subject<boolean[]>;

    _subscription: any

    ngOnChanges(changes) {
        var reqRes = changes.reqRes.currentValue as ReqRes;
        if (this._subscription) { this._subscription.unsubscribe; delete this._subscription; }

        this._subscription = reqRes.updated.subscribe((evt: Update) => {
            if (evt == Update.RES_HEADERS) {
                this.cd.markForCheck();
            }
        });
    }

    get flags() {
        if (!this.reqRes) { return ""; }

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

}
