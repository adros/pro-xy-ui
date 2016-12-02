import { Component, OnInit } from '@angular/core';
import { SocketService } from '../service/socket.service';
import { Observable } from 'rxjs/Observable';

@Component({
    moduleId: module.id,
    templateUrl: 'url-replace.component.html',
    styleUrls: ['url-replace.component.css'],
    selector: 'url-replace'
})
export class UrlReplaceComponent implements OnInit {

    configObservable: Observable<Object>
    config: any

    constructor(private socketService: SocketService) { }

    ngOnInit(): void {
        this.configObservable = this.socketService.getConfigObservable();
        this.configObservable.subscribe(config => { this.config = config; })
    }

    hChange(item, index) {
        item.disabled = !item.disabled; //changed by reference
        this.socketService.replaceConfig(this.config);
    }
}
