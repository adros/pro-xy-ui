import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import {RequestsComponent} from './requests.component';
import { ReqRes } from '../../model/http';

const {remote, clipboard} = nodeRequire("electron");
const {MenuItem} = remote;

export class BodyMenu {

    private menuBodyItems: any[]
    private _miCopyReqRes: any
    private _miAutoResponse: any
    private _miComposer: any
    private _miReplay: any

    _lastReqRes: ReqRes

    constructor(private requestsComponent: RequestsComponent, zone: NgZone) {
        //TODO: electron
        this._miCopyReqRes = new MenuItem({ label: "Copy req & res", click: () => clipboard.writeText(this._lastReqRes.toString()) });
        this._miAutoResponse = new MenuItem({ label: "Save as auto response", click: () => zone.run(() => requestsComponent.autoResponse.emit(this._lastReqRes)) });
        this._miComposer = new MenuItem({ label: "Compose", click: () => zone.run(() => requestsComponent.compose.emit(this._lastReqRes)) });
        this._miReplay = new MenuItem({ label: "Replay", click: () => zone.run(() => requestsComponent.replay.emit(this._lastReqRes)) });

        this.menuBodyItems = [
            new MenuItem({ label: "Copy URL", click: () => clipboard.writeText(this._lastReqRes.url) }),
            this._miCopyReqRes,
            new MenuItem({ type: "separator" }),
            this._miAutoResponse,
            this._miComposer,
            this._miReplay,
            new MenuItem({ type: "separator" })
        ];
    }

    update(idx) {
        let enabledHeaders = this.requestsComponent.enabledHeaders.getValue();
        enabledHeaders[idx] = !enabledHeaders[idx];
        this.requestsComponent.enabledHeaders.next(enabledHeaders);
    }

    getMenuItems(reqRes: ReqRes, evt) {
        this._lastReqRes = reqRes;

        this._miCopyReqRes.enabled = reqRes.isFinished;
        this._miAutoResponse.enabled = reqRes.isFinished;
        this._miComposer.enabled = reqRes.isReqFinished;
        this._miReplay.enabled = reqRes.isReqFinished;

        return this.menuBodyItems;
    }

}
