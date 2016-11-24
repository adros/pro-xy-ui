import { Component, OnInit } from '@angular/core';
import { SocketService } from './service/socket.service';
import { ConfigService } from './service/config.service';
import { Observable } from 'rxjs/Observable';

var cp = nw.require("child_process");
var path = nw.require("path");

@Component({
    moduleId: module.id,
    selector: 'my-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    constructor(private socketService: SocketService, private configService: ConfigService) { }

    statusObservable: Observable<boolean>

    ngOnInit(): void {
        this.statusObservable = this.socketService.getConnectStatusObservable();
    }

    startProxy() {
        try {
            var cs = this.configService;
            if (!cs.configExists()) {
                var create = confirm("Config does not exists. Create default config?");
                if (!create) {
                    return;
                }
                cs.createDefaultConfig();
            }
            var config = cs.getConfig();
            if (!~config.plugins.indexOf("pro-xy-ws-api")) {
                throw new Error("Config does not contain 'pro-xy-ws-api' plugin which is needed for pro-xy-ui. Not starting pro-xy.")
            }

            var proxyPath = path.resolve(path.dirname(process.mainModule.filename), "./node_modules/.bin/pro-xy");
            var proxyProcess = cp.spawn(proxyPath, [], { detached: true, stdio: 'ignore' });
            proxyProcess.unref();
            console.log("PID", proxyProcess.pid);
        } catch (e) {
            alert(`Error while starting proxy: ${e.message}`);
        }
    }

    killProxy() {
        this.socketService.sendKillSignal();
    }
}
