import { Component, OnInit } from '@angular/core';
import { SocketService } from '../service/socket.service';
import { Observable } from 'rxjs';

@Component({
    moduleId: module.id,
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css'],
    selector: 'home',
    host: { class: 'flex-grow' }
})
export class HomeComponent implements OnInit {

    constructor(private socketService: SocketService) { }

    requestsObservable: Observable<any[]>
    _requestsCache: any[] = []

    replacedOnly = true
    maxRows = 50

    ngOnInit(): void {
        this.requestsObservable = this.socketService.getRequestsObservable()
            .filter(req => !this.replacedOnly || req.origUrl)
            .map(req => {
                var reqs = this._requestsCache
                reqs.push(req);
                reqs.length > this.maxRows && reqs.shift();
                return reqs.slice(0);
            });
    }

}
