import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SocketService } from '../../service/socket.service';
import { ConfigListBase } from '../config-list-base';
import { ReqRes } from '../../model/http';

var path = nw.require("path");
var url = nw.require("url");
var fs = nw.require("fs");
var format = nw.require('date-format');
var escapeStringRegexp = nw.require('escape-string-regexp');

@Component({
    moduleId: module.id,
    templateUrl: 'auto-responder.component.html',
    styleUrls: ['auto-responder.component.css'],
    selector: 'auto-responder',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoResponder extends ConfigListBase {

    configProperty = "autoResponder"

    //TODO: how can we move this to parent?
    constructor(socketService: SocketService) {
        super();
        this.socketService = socketService;
    }


    openFile(event, item) {
        event.preventDefault();

        var path = this.getFileLocation(item.target)

        if (!fs.existsSync(path)) {
            fs.writeFileSync(path, "");
        }
        nw.Shell.openItem(path);
    }

    getFileLocation(target) {
        if (path.isAbsolute(target)) {
            return target;
        }
        return path.join(process.env.HOME, ".auto-respond", target);
    }

    add(reqRes: ReqRes) {
        if (!this.config) {
            alert("Config not availible");
            return;
        }

        var headers = reqRes.resHeaders;
        if (reqRes.isGzip) {
            //we have unzipped the response
            delete headers["content-encoding"];
        }

        var fileName = makeName(reqRes.url);
        var path = this.getFileLocation(fileName);

        fs.writeFileSync(path, reqRes.resBody);

        this.config.addAutoResponse({
            urlPattern: escapeStringRegexp(reqRes.url),
            status: reqRes.statusCode,
            headers: headers,
            method: reqRes.method,
            target: fileName,
            disabled: false
        });
        this.socketService.replaceConfig(this.config);

        function makeName(_url) {
            var path = url.parse(_url).pathname.replace(/\/$/, "");
            return `${path.split("/").slice(-2).join("_")}_${format('yyyyMMdd_hhmmss', new Date())}`;
        }
    }

}
