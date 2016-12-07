import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../service/socket.service';
import { Observable } from 'rxjs/Observable';

@Component({
    moduleId: module.id,
    templateUrl: 'config.component.html',
    styleUrls: ['config.component.css'],
    selector: 'config',
    host: { class: 'flex-grow' }
})
export class ConfigComponent implements OnInit {

    configObservable: Observable<any>
    updatedConfig: string

    constructor(private socketService: SocketService) { }

    ngOnInit(): void {
        this.configObservable = this.socketService.getConfigObservable();
    }

    save(): void {
        var confObj;
        try {
            confObj = JSON.parse(this.updatedConfig);
        } catch (e) {
            alert("Config is not valid JSON");
        }
        this.socketService.replaceConfig(confObj);
    }

    hChange(value): void {
        this.updatedConfig = value
    }
}
