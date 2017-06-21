import { OnInit } from '@angular/core';
import { SocketService } from '../service/socket.service';
import { Observable } from 'rxjs/Observable';

export abstract class ConfigListBase implements OnInit {

    configObservable: Observable<Object>
    config: any

    configProperty: string
    itemsProperty: string
    socketService: SocketService

    protected menuItems: any[]

    constructor() {
        this.menuItems = [
            //TODO: electronnew nw.MenuItem({ label: "Delete", click: () => this.deleteItem(this._lastCtxItem) }),
            //TODO: electronnew nw.MenuItem({ type: "separator" })
        ];
    }


    ngOnInit(): void {
        this.configObservable = this.socketService.configObservable;
        this.configObservable.subscribe(config => { this.config = config; })
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
        //TODO: electronnw.Shell.openExternal($event.target.href);
    }

    deleteItem(item) {
        var items = this.config[this.configProperty][this.itemsProperty] as any[];
        items.splice(items.indexOf(item), 1);
        this.socketService.replaceConfig(this.config);
    }

    _lastCtxItem: any

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
