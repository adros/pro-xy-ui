"use strict";
const { remote, clipboard } = nodeRequire("electron");
const { MenuItem } = remote;
class BodyMenu {
    constructor(requestsComponent, zone) {
        this.requestsComponent = requestsComponent;
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
    getMenuItems(reqRes, evt) {
        this._lastReqRes = reqRes;
        this._miCopyReqRes.enabled = reqRes.isFinished;
        this._miAutoResponse.enabled = reqRes.isFinished;
        this._miComposer.enabled = reqRes.isReqFinished;
        this._miReplay.enabled = reqRes.isReqFinished;
        return this.menuBodyItems;
    }
}
exports.BodyMenu = BodyMenu;
