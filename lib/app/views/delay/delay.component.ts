import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SocketService } from '../../service/socket.service';
import { ConfigListBase } from '../config-list-base'

@Component({
    moduleId: module.id,
    templateUrl: 'delay.component.html',
    styleUrls: ['delay.component.css'],
    selector: 'delay',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DelayComponent extends ConfigListBase {
    configProperty = "delay"

    //TODO: how can we move this to parent?
    constructor(socketService: SocketService) {
        super();
        this.socketService = socketService;
    }
}
