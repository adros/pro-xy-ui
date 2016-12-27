"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
const core_1 = require("@angular/core");
const socket_service_1 = require("../../service/socket.service");
const config_list_base_1 = require("../config-list-base");
var path = nw.require("path");
var url = nw.require("url");
var fs = nw.require("fs");
var format = nw.require('date-format');
var escapeStringRegexp = nw.require('escape-string-regexp');
let AutoResponder = class AutoResponder extends config_list_base_1.ConfigListBase {
    //TODO: how can we move this to parent?
    constructor(socketService) {
        super();
        this.configProperty = "autoResponder";
        this.socketService = socketService;
    }
    openFile(event, item) {
        event.preventDefault();
        var path = this.getFileLocation(item.target);
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
    add(reqRes) {
        if (!this.config) {
            alert("Config not availible");
            return;
        }
        var headers = reqRes.resHeaders;
        if (reqRes.isGzip) {
            //we have unzipped the response
            delete headers["content-encoding"];
        }
        delete headers["content-length"]; //node will count it automatically
        var fileName = makeName(reqRes.url);
        var filePath = this.getFileLocation(fileName);
        var autoRespFolder = path.join(process.env.HOME, ".auto-respond");
        if (!fs.existsSync(autoRespFolder)) {
            fs.mkdirSync(autoRespFolder);
        }
        fs.writeFileSync(filePath, reqRes.resBody);
        this.config.addAutoResponse({
            urlPattern: "^" + escapeStringRegexp(reqRes.url) + "$",
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
};
AutoResponder = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'auto-responder.component.html',
        styleUrls: [
            'auto-responder.component.css'
        ],
        selector: 'auto-responder',
        changeDetection: core_1.ChangeDetectionStrategy.OnPush
    }),
    __metadata("design:paramtypes", [socket_service_1.SocketService])
], AutoResponder);
exports.AutoResponder = AutoResponder;
