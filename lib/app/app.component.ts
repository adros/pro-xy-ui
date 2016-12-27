import { Component, OnInit, ViewChild, NgZone, ChangeDetectionStrategy} from "@angular/core";
import { Http, Response } from '@angular/http';
import { SocketService } from "./service/socket.service";
import { StatusComponent } from "./views/status/status.component";
import { InspectorComponent } from "./views/inspector/inspector.component";
import { Observable } from "rxjs/Observable";
import { openAppMenu } from "./_common/app-menu";
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';

var semver = nw.require("semver");

@Component({
    moduleId: module.id,
    selector: "my-app",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
    constructor(private socketService: SocketService, private zone: NgZone, private http: Http, private snackBar: MdSnackBar) { }

    configObservable: Observable<Object>;
    statusObservable: Observable<boolean>;

    @ViewChild("status") status: StatusComponent;
    @ViewChild("inspector") inspector: InspectorComponent;
    @ViewChild("autoResponder") autoResponder: any;
    @ViewChild("connection") connection: any;

    _selectedReqRes: any
    set selectedReqRes(selectedReqRes) {
        this._selectedReqRes = selectedReqRes;
        this.selectedView = "inspector";
    }
    get selectedReqRes() {
        return this._selectedReqRes;
    }

    selectedView = "urlReplace"

    ngOnInit(): void {
        this.socketService.configObservable.subscribe(config => {
            var replaces = config.urlReplace.replaces;
            var activeUrlReplaces = replaces.filter(r => !r.disabled).map(r => r.name);
            document.title = activeUrlReplaces.length ? `PRO-XY (${activeUrlReplaces.join(", ")})` : "PRO-XY";
        });

        this.registerShortcut();
        this.checkVersion();

        this.statusObservable = this.socketService.connectStatusObservable;
        this.statusObservable.subscribe(connected => !connected && (this.selectedView = "logs"))
    }

    toggleStatus() {
        this.status.toggle();
    }

    private registerShortcut() {
        var shortcut = new nw.Shortcut({
            key: "Ctrl+R",
            active: () => this.zone.run(() => this.socketService.connectToRemote())
        });
        nw.App.registerGlobalHotKey(shortcut);
    }

    openAppMenu = openAppMenu

    checkVersion() {
        this.http.get("http://registry.npmjs.org/pro-xy-ui?cacheBust=" + Math.random())
            .toPromise()
            .then(response => {
                var currentVersion = nw.require("nw.gui").App.manifest.version;
                var latestVersion = response.json()["dist-tags"].latest;

                if (semver.gt(latestVersion, currentVersion)) {
                    this.snackBar.open(`New version availible ${latestVersion} (current version ${currentVersion})`, null, {
                        duration: 4000,
                    } as MdSnackBarConfig);
                }

            })
            .catch(err => console.error("Error while geting lates version", err));
    }
}
