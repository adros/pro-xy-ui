import { Component, OnInit } from '@angular/core';
import { SocketService } from '../service/socket.service';
import { Observable } from 'rxjs';

@Component({
    moduleId: module.id,
    templateUrl: 'status.component.html',
    // styleUrls: ['home.component.css'],
    selector: 'status'
})
export class StatusComponent implements OnInit {


    constructor(private socketService: SocketService) { }

    logs: Observable<String[]>
    _logs: String[] = []

    maxSize = 10

    ngOnInit(): void {
        this.logs = this.socketService.getLogsObservable()
            .map(logStr => {
                var logs = this._logs
                logs.push(logStr);
                logs.length > this.maxSize && logs.shift();
                return logs.slice(0);
            });
    }

}
