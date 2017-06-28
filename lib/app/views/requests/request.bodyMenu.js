"use strict";
var gui = nw.require('nw.gui');
var clipboard = gui.Clipboard.get();
class BodyMenu {
    constructor(requestsComponent, zone) {
        this.requestsComponent = requestsComponent;
        this._miCopyReqRes = new nw.MenuItem({ label: "Copy request & response", click: () => clipboard.set(this._lastReqRes.toString(), "text") });
        this._miCopyReqBody = new nw.MenuItem({ label: "Copy request payload", click: () => clipboard.set(this._lastReqRes.reqBody, "text") }),
            this._miCopyResBody = new nw.MenuItem({ label: "Copy response payload", click: () => clipboard.set(this._lastReqRes.resBody, "text") }),
            this._miAutoResponse = new nw.MenuItem({ label: "Save as auto response", click: () => zone.run(() => requestsComponent.autoResponse.emit(this._lastReqRes)) });
        this._miComposer = new nw.MenuItem({ label: "Compose", click: () => zone.run(() => requestsComponent.compose.emit(this._lastReqRes)) });
        this._miReplay = new nw.MenuItem({ label: "Replay", click: () => zone.run(() => requestsComponent.replay.emit(this._lastReqRes)) });
        this.menuBodyItems = [
            new nw.MenuItem({ label: "Copy URL", click: () => clipboard.set(this._lastReqRes.url, "text") }),
            this._miCopyReqRes,
            this._miCopyReqBody,
            this._miCopyResBody,
            new nw.MenuItem({ type: "separator" }),
            this._miAutoResponse,
            this._miComposer,
            this._miReplay,
            new nw.MenuItem({ type: "separator" })
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
        this._miCopyReqBody.enabled = reqRes.isFinished;
        this._miCopyResBody.enabled = reqRes.isFinished;
        this._miAutoResponse.enabled = reqRes.isFinished;
        this._miComposer.enabled = reqRes.isReqFinished;
        this._miReplay.enabled = reqRes.isReqFinished;
        return this.menuBodyItems;
    }
}
exports.BodyMenu = BodyMenu;
