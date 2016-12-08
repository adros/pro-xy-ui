import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../service/socket.service';
import { ConfigService } from '../../service/config.service';
import { Observable } from 'rxjs/Observable';

var cp = nw.require("child_process");
var path = nw.require("path");
var fs = nw.require("fs");
var os = nw.require("os");

var PROXY_ERR_OUT_PATH = path.join(os.tmpdir(), "pro-xy-tmp-err.log");


@Component({
    moduleId: module.id,
    templateUrl: 'connection.component.html',
    styleUrls: ['connection.component.css'],
    selector: 'connection'
})
export class ConnectionComponent implements OnInit {

    statusObservable: Observable<boolean>

    constructor(private socketService: SocketService, private configService: ConfigService) { }

    ngOnInit(): void {
        this.statusObservable = this.socketService.connectStatusObservable;
        this.socketService.configObservable.subscribe(config => {
            var replaces = config.proxyUrlReplace.replaces;
            var activeUrlReplaces = replaces.filter(r => !r.disabled).map(r => r.name);
            document.title = activeUrlReplaces.length ? `PRO-XY (${activeUrlReplaces.join(", ")})` : "PRO-XY";
        });
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

            var proxyPath = path.resolve(path.dirname((process as any).mainModule.filename), "./node_modules/.bin/pro-xy");
            if (/^win/.test(process.platform)) {
                proxyPath += ".cmd";
            }
            var errFileDesc = fs.openSync(PROXY_ERR_OUT_PATH, "w+");
            var proxyProcess = cp.spawn(proxyPath, [], { detached: true, stdio: ["ignore", "ignore", errFileDesc] });
            proxyProcess.unref();

            setTimeout(() => this.checkErrOut(errFileDesc), 1000); //wait 1sec then check if theres some err out of started process
        } catch (e) {
            alert(`Error while starting proxy: ${e.message}`);
        }
    }

    killProxy() {
        this.socketService.sendKillSignal();
    }

    checkErrOut(fd) {
        var content = fs.readFileSync(PROXY_ERR_OUT_PATH, "utf8");
        if (!!content) {
            alert("Error while starting pro-xy: " + content);
        }
    }
}
