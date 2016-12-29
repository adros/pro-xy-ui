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
const http_1 = require("@angular/http");
const socket_service_1 = require("../../service/socket.service");
const http_2 = require("../../model/http");
var app = nw.require('nw.gui').App;
var validUrl = nw.require('valid-url');
var url = nw.require('url');
var SAMPLE_REQUEST = 'POST http://jsonplaceholder.typicode.com/posts\ncontent-type: application/json\naccept: */*\n\n{"sample":1}';
let ComposerComponent = class ComposerComponent {
    constructor(http, socketService) {
        this.http = http;
        this.socketService = socketService;
        this.invalid = false;
        this._message = "";
    }
    ngOnInit() {
        this.loadSample();
        this.socketService.configObservable.subscribe(config => { this.config = config; });
    }
    set reqRes(reqRes) {
        if (!reqRes) {
            return;
        }
        this.model = `${reqRes.method} ${reqRes.url}\n${reqRes.reqHeadersStr}\n\n${reqRes.reqBody}`;
    }
    get message() { return this._message; }
    set message(message) {
        this._message = message;
        this.invalid = !!message;
    }
    get model() { return this._model; }
    set model(model) {
        this._model = model;
        try {
            this.parsedModel = this.parse(this.model);
            this.message = null;
        }
        catch (e) {
            this.message = e.message;
        }
    }
    parse(value) {
        if (!value) {
            throw new Error("Method and URL are required");
        }
        var lines = value.split(/\r\n?|\n/);
        var parts = lines.shift().split(" ");
        var method = parts[0].trim();
        if (!/^(get|post|put|delete|options|head)$/i.test(method)) {
            throw new Error(`Unknown method: ${method}`);
        }
        ;
        var uri = parts.slice(1).join(" ").trim();
        //if (!validUrl.isUri(url)) { //this is now working for some urls, eg: http://toplist.cz/count.asp?id=1128198&logo=mc&http&t=ForcaBarca.sk%2C%20informa%u010Dn%FD%20servis%20FC%20Barcelona&wi=1920&he=1080&cd=24
        //http://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
        //if (!/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/.test(url)) {
        validateUrl(uri);
        var bodySepIdx = lines.indexOf("");
        var headerLines = ~bodySepIdx ? lines.slice(0, bodySepIdx) : lines;
        var headers = headerLines.reduce((obj, line) => {
            var parts = line.split(":");
            var name = parts.shift().trim();
            var value = parts.join(":").trim();
            if (!isValidHeaderName(name)) {
                throw new Error(`Invalid header name '${name}'`);
            }
            if (!value) {
                throw new Error(`Invalid header line '${line}'`);
            }
            obj[name] = value;
            return obj;
        }, {});
        var body = "";
        if (~bodySepIdx) {
            body = lines.slice(bodySepIdx + 1).join("\n");
        }
        return { method, url: uri, headers, body };
        function isValidHeaderName(val) {
            //https://www.w3.org/Protocols/rfc2616/rfc2616-sec2.html#sec2.2
            return /^[ -~]+$/.test(val) && !/[\(\)<>@,;:\\<>\/\[\]\?={} \t]/.test(val);
        }
        function validateUrl(val) {
            var parsed = url.parse(val);
            if (!parsed.protocol || !parsed.host) {
                throw new Error("Only absolute URLs are allowed");
            }
            if (!/^http:$/i.test(parsed.protocol)) {
                throw new Error("Only HTTP protocol is allowed");
            }
        }
    }
    send() {
        var req = this.parsedModel;
        let options = new http_1.RequestOptions({
            //AR:do not add no-cache, we do not want to spoil headers, we will clear the cache (disabling cache in nw.js seems to be buggy, see issues)
            //headers: new Headers(Object.assign({ pragma: "no-cache" }, req.headers)),
            headers: new http_1.Headers(req.headers),
            method: req.method,
            body: req.body
        });
        app.clearCache();
        app.setProxyConfig(`http=localhost:${this.config.port},direct://;direct://`);
        this.http.request(req.url, options)
            .toPromise()
            .catch(() => null) // no op
            .then(() => app.setProxyConfig(""));
    }
    loadSample() {
        this.model = SAMPLE_REQUEST;
    }
};
__decorate([
    core_1.Input(),
    __metadata("design:type", http_2.ReqRes),
    __metadata("design:paramtypes", [http_2.ReqRes])
], ComposerComponent.prototype, "reqRes", null);
ComposerComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'composer.component.html',
        styleUrls: ['composer.component.css'],
        selector: 'composer',
        host: { class: 'flex-grow' },
        changeDetection: core_1.ChangeDetectionStrategy.OnPush
    }),
    __metadata("design:paramtypes", [http_1.Http, socket_service_1.SocketService])
], ComposerComponent);
exports.ComposerComponent = ComposerComponent;
