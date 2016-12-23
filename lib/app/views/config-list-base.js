"use strict";
class ConfigListBase {
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
}
exports.ConfigListBase = ConfigListBase;
