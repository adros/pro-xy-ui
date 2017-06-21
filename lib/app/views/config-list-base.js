"use strict";
const { shell, remote } = nodeRequire("electron");
const { MenuItem } = remote;
class ConfigListBase {
    constructor() {
        this.menuItems = [
            new MenuItem({ label: "Delete", click: () => this.deleteItem(this._lastCtxItem) }),
            new MenuItem({ type: "separator" })
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
        shell.openExternal($event.target.href);
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
    addEmptyConfig() {
        this.socketService.updateConfig({
            [this.configProperty]: {
                disabled: false,
                [this.itemsProperty]: []
            }
        });
    }
}
exports.ConfigListBase = ConfigListBase;
