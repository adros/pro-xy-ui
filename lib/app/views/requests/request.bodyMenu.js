"use strict";
//TODO: electron
//var gui = nodeRequire('nw.gui');
//var clipboard = gui.Clipboard.get();
class BodyMenu {
    constructor(requestsComponent, zone) {
        this.requestsComponent = requestsComponent;
        //TODO: electron
        // this._miCopyReqRes = new nw.MenuItem({ label: "Copy req & res", click: () => clipboard.set(this._lastReqRes.toString(), "text") });
        // this._miAutoResponse = new nw.MenuItem({ label: "Save as auto response", click: () => zone.run(() => requestsComponent.autoResponse.emit(this._lastReqRes)) });
        // this._miComposer = new nw.MenuItem({ label: "Compose", click: () => zone.run(() => requestsComponent.compose.emit(this._lastReqRes)) });
        // this._miReplay = new nw.MenuItem({ label: "Replay", click: () => zone.run(() => requestsComponent.replay.emit(this._lastReqRes)) });
        //
        // this.menuBodyItems = [
        //     new nw.MenuItem({ label: "Copy URL", click: () => clipboard.set(this._lastReqRes.url, "text") }),
        //     this._miCopyReqRes,
        //     new nw.MenuItem({ type: "separator" }),
        //     this._miAutoResponse,
        //     this._miComposer,
        //     this._miReplay,
        //     new nw.MenuItem({ type: "separator" })
        // ];
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
