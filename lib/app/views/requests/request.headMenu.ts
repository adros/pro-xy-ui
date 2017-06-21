import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import {RequestsComponent} from './requests.component';

const {remote} = nodeRequire("electron");
const {MenuItem} = remote;

export class HeadMenu {

    private menuHeadItems: any[]
    private _miHeadMethod: any
    private _miHeadStatus: any
    private _miHeadHost: any
    private _miHeadPath: any
    private _miHeadContentType: any
    private _miHeadFlags: any

    constructor(private requestsComponent: RequestsComponent, zone: NgZone) {
        let ths = Array.prototype.slice.call(requestsComponent.tableHead.nativeElement.querySelectorAll("th"), 1);
        let enabledHeaders = requestsComponent.enabledHeaders.getValue();

        this.menuHeadItems = ths.map((th, idx) => new MenuItem({
            label: th.innerHTML,
            type: "checkbox",
            checked: enabledHeaders[idx],
            click: () => zone.run(() => this.update(idx))
        }));

        this.menuHeadItems.push(new MenuItem({ type: "separator" }))
    }

    update(idx) {
        let enabledHeaders = this.requestsComponent.enabledHeaders.getValue();
        enabledHeaders[idx] = !enabledHeaders[idx];
        this.requestsComponent.enabledHeaders.next(enabledHeaders);
    }

    getMenuItems(evt) {
        return this.menuHeadItems;
    }

}
