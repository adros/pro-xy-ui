import { Component, OnChanges, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ReqRes, Update } from '../../model/http';

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

}
