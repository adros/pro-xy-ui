import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SocketService } from '../../service/socket.service';
import { ConfigListBase } from '../config-list-base'

@Component({
    moduleId: module.id,
    templateUrl: 'url-replace.component.html',
    styleUrls: ['url-replace.component.css'],
    selector: 'url-replace',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UrlReplaceComponent extends ConfigListBase {
    configProperty = "urlReplace"
    itemsProperty = "replaces"

    //TODO: how can we move this to parent?
    constructor(socketService: SocketService) {
        super();
        this.socketService = socketService;
    }
}
