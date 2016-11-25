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

    replacedOnly = true
    maxRows = 50

    ngOnInit(): void {
        this.requestsObservable = this.socketService.getRequestsObservable()
            .filter(req => !this.replacedOnly || !!req.origUrl)
            .scan((arr, req) => {
                arr.push(req);
                return arr.slice(-1 * this.maxRows);
            }, []);
    }

}
