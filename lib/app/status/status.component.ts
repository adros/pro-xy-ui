import { Component, OnInit, ElementRef } from '@angular/core';
import { SocketService } from '../service/socket.service';
import { Observable } from 'rxjs';

@Component({
    moduleId: module.id,
    templateUrl: 'status.component.html',
    styleUrls: ['status.component.css'],
    selector: 'status'
})
export class StatusComponent implements OnInit {


    constructor(private socketService: SocketService, private rootElement: ElementRef) { }

    logs: Observable<String[]>

    bufferSize = 20

    ngOnInit(): void {
        this.logs = this.socketService.getLogsObservable()
            .scan((arr, logStr) => {
                arr.push(logStr);
                arr.length > this.bufferSize && arr.shift();
                return arr.slice(0);
            }, []);
    }

    toggle() {
        this.rootElement.nativeElement.classList.toggle("minimized");
    }

}
