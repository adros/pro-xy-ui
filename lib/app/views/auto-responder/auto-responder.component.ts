import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SocketService } from '../../service/socket.service';
import { ConfigListBase } from '../config-list-base'
var path = nw.require("path");

@Component({
    moduleId: module.id,
    templateUrl: 'auto-responder.component.html',
    styleUrls: ['auto-responder.component.css'],
    selector: 'auto-responder',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoResponder extends ConfigListBase {

    configProperty = "autoResponder"

    //TODO: how can we move this to parent?
    constructor(socketService: SocketService) {
        super();
        this.socketService = socketService;
    }


    openFile(event, item) {
        event.preventDefault();
        nw.Shell.openItem(this.getFileLocation(item.target));
    }

    getFileLocation(target) {
        if (path.isAbsolute(target)) {
            return target;
        }
        return path.join(process.env.HOME, ".auto-respond", target);
    }

}
