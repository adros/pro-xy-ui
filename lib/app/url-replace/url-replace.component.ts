import { Component, OnInit } from '@angular/core';
import { SocketService } from '../service/socket.service';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
    moduleId: module.id,
    templateUrl: 'url-replace.component.html',
    styleUrls: ['url-replace.component.css'],
    selector: 'url-replace'
})
export class UrlReplaceComponent implements OnInit {

    configObservable: BehaviorSubject<Object>

    constructor(private socketService: SocketService) { }

    ngOnInit(): void {
        this.configObservable = this.socketService.getConfigObservable();
    }

    hChange(item, index) {
        item.disabled = !item.disabled; //changed by reference
        this.socketService.replaceConfig(this.configObservable.value);
    }
}
