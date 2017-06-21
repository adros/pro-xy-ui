import { Component, Input, ChangeDetectionStrategy, OnChanges, ChangeDetectorRef } from '@angular/core';
import { ReqRes } from '../../model/http';

const {remote, clipboard} = nodeRequire("electron");
const {MenuItem} = remote;

@Component({
    moduleId: module.id,
    templateUrl: 'inspector.component.html',
    styleUrls: ['inspector.component.css'],
    selector: 'inspector',
    host: { class: 'flex-grow' }
})
export class InspectorComponent implements OnChanges {

    @Input() reqRes: ReqRes;

    private menuItems: any[]

    constructor(private cd: ChangeDetectorRef) {
        this.menuItems = [
            new MenuItem({ label: "Copy URL", click: () => this.reqRes && clipboard.writeText(this.reqRes.url) }),
            new MenuItem({ label: "Copy req & res", click: () => this.reqRes && clipboard.writeText(this.reqRes.toString()) }),
            new MenuItem({ type: "separator" })
        ];
    }

    hCtxMenu(evt) {
        evt.menuItems = (evt.menuItems || []).concat(this.menuItems);
    }

    selectAll(evt) {
        var sel = window.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.selectNodeContents(evt.target);
        sel.addRange(range);
    }

    _subscription: any

    ngOnChanges(changes) {
        if (this._subscription) { this._subscription.unsubscribe; delete this._subscription; }
        var reqRes = changes.reqRes.currentValue as ReqRes;
        if (!reqRes) { return; }

        this._subscription = reqRes.updated.subscribe(() => this.cd.markForCheck());
    }

}
