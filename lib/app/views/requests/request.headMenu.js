"use strict";
class HeadMenu {
    constructor(requestsComponent, zone) {
        this.requestsComponent = requestsComponent;
        let ths = Array.prototype.slice.call(requestsComponent.tableHead.nativeElement.querySelectorAll("th"), 1);
        let enabledHeaders = requestsComponent.enabledHeaders.getValue();
        //TODO: electron
        // this.menuHeadItems = ths.map((th, idx) => new nw.MenuItem({
        //     label: th.innerHTML,
        //     type: "checkbox",
        //     checked: enabledHeaders[idx],
        //     click: () => zone.run(() => this.update(idx))
        // }));
        //
        // this.menuHeadItems.push(new nw.MenuItem({ type: "separator" }))
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
exports.HeadMenu = HeadMenu;
