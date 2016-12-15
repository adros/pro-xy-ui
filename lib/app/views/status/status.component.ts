import { Component, OnInit, ElementRef,ChangeDetectionStrategy } from '@angular/core';
import { SocketService } from '../../service/socket.service';
import { Observable } from 'rxjs';

@Component({
    moduleId: module.id,
    templateUrl: 'status.component.html',
    styleUrls: ['status.component.css'],
    selector: 'status',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusComponent implements OnInit {


    constructor(private socketService: SocketService, private rootElement: ElementRef) { }

    logs: Observable<String[]>

    bufferSize = 20

    ngOnInit(): void {
        this.logs = this.socketService.logsObservable
            .scan((arr, logStr) => {
                arr.push(logStr);
                return arr.slice(-1 * this.bufferSize);
            }, []);
    }

    toggle() {
        this.rootElement.nativeElement.classList.toggle("minimized");
    }

}
