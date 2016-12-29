"use strict";
class ConfigListBase {
    constructor() {
        this.menuItems = [
            new nw.MenuItem({ label: "Delete", click: () => this.deleteItem(this._lastCtxItem) }),
            new nw.MenuItem({ type: "separator" })
        ];
    }
    ngOnInit() {
        this.configObservable = this.socketService.configObservable;
        this.configObservable.subscribe(config => { this.config = config; });
    }
    hChange(item, index) {
        item.disabled = !item.disabled; //changed by reference
        this.socketService.replaceConfig(this.config);
    }
    toggleDisabled() {
        this.config[this.configProperty].disabled = !this.config[this.configProperty].disabled;
        this.socketService.replaceConfig(this.config);
    }
    openUrl($event) {
        $event.preventDefault();
        nw.Shell.openExternal($event.target.href);
    }
    deleteItem(item) {
        var items = this.config[this.configProperty][this.itemsProperty];
        items.splice(items.indexOf(item), 1);
        this.socketService.replaceConfig(this.config);
    }
    hCtxMenu(item, evt) {
        this._lastCtxItem = item;
        evt.menuItems = (evt.menuItems || []).concat(this.menuItems);
    }
}
exports.ConfigListBase = ConfigListBase;
