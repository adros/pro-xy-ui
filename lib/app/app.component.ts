import { Component, OnInit, ViewChild, NgZone } from "@angular/core";
import { SocketService } from "./service/socket.service";
import { StatusComponent } from "./views/status/status.component";
import { InspectorComponent } from "./views/inspector/inspector.component";
import { Observable } from "rxjs/Observable";
import { openAppMenu } from "./_common/app-menu"

@Component({
    moduleId: module.id,
    selector: "my-app",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
    constructor(private socketService: SocketService, private zone: NgZone) { }

    configObservable: Observable<Object>

    @ViewChild("status") status: StatusComponent;
    @ViewChild("inspector") inspector: InspectorComponent;

    selectedView = "urlReplace"

    ngOnInit(): void {
        this.socketService.configObservable.subscribe(config => {
            var replaces = config.proxyUrlReplace.replaces;
            var activeUrlReplaces = replaces.filter(r => !r.disabled).map(r => r.name);
            document.title = activeUrlReplaces.length ? `PRO-XY (${activeUrlReplaces.join(", ")})` : "PRO-XY";
        });

        this.registerShortcut();
    }

    toggleStatus() {
        this.status.toggle();
    }

    inspect(reqRes) {
        this.inspector.reqRes = reqRes;
        this.selectedView = "inspector";
    }

    private registerShortcut() {
        var shortcut = new nw.Shortcut({
            key: "Ctrl+R",
            active: () => this.zone.run(() => this.socketService.connectToRemote())
        });
        nw.App.registerGlobalHotKey(shortcut);
    }

    openAppMenu = openAppMenu

}
