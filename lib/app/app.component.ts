import { Component, OnInit, ViewChild } from '@angular/core';
import { SocketService } from './service/socket.service';
import { StatusComponent } from './views/status/status.component';
import { InspectorComponent } from './views/inspector/inspector.component';
import { Observable } from 'rxjs/Observable';

@Component({
    moduleId: module.id,
    selector: 'my-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    constructor(private socketService: SocketService) { }

    configObservable: Observable<Object>

    @ViewChild('status') status: StatusComponent;
    @ViewChild('inspector') inspector: InspectorComponent;

    selectedView = "urlReplace"

    ngOnInit(): void {
        this.socketService.getConfigObservable().subscribe(config => {
            var replaces = config.proxyUrlReplace.replaces;
            var activeUrlReplaces = replaces.filter(r => !r.disabled).map(r => r.name);
            document.title = activeUrlReplaces.length ? `PRO-XY (${activeUrlReplaces.join(", ")})` : "PRO-XY";
        });
    }

    toggleStatus() {
        this.status.toggle();
    }

    inspect(reqRes) {
        this.inspector.reqRes = reqRes;
        this.selectedView = "inspector";
    }


}
