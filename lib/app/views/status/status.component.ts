import { Component, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { SocketService } from '../../service/socket.service';
import { Observable } from 'rxjs';

const MINIMIZED = localStorage.getItem("statusComponent-minimized") == "true";

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

    minimized: boolean;

    ngOnInit(): void {
        this.logs = this.socketService.logsObservable
            .scan((arr, logStr) => {
                arr.push(logStr);
                return arr.slice(-1 * this.bufferSize);
            }, []);

        let e = this.rootElement.nativeElement;
        e.classList.add("notransition");
        this.toggle(MINIMIZED);
        e.offsetHeight; // Trigger a reflow, flushing the CSS changes
        e.classList.remove("notransition");
    }

    toggle(force?) {
        this.minimized = force != null ? force : !this.minimized;
        this.rootElement.nativeElement.classList.toggle("minimized", this.minimized);
        localStorage.setItem("statusComponent-minimized", this.minimized + "");
    }

}
