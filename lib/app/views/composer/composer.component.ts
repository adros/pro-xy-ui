import { Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core';
import { Http, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { SocketService } from '../../service/socket.service';
import { ReqRes } from '../../model/http';
var app = nw.require('nw.gui').App;
var validUrl = nw.require('valid-url');
var url = nw.require('url');

var SAMPLE_REQUEST = 'POST http://jsonplaceholder.typicode.com/posts\ncontent-type: application/json\naccept: */*\n\n{"sample":1}';

@Component({
    moduleId: module.id,
    templateUrl: 'composer.component.html',
    styleUrls: ['composer.component.css'],
    selector: 'composer',
    host: { class: 'flex-grow' },
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComposerComponent implements OnInit {

    constructor(private http: Http, private socketService: SocketService) { }

    config: any

    ngOnInit(): void {
        this.loadSample();
        this.socketService.configObservable.subscribe(config => { this.config = config; })
    }

    invalid = false

    @Input()
    set reqRes(reqRes: ReqRes) {
        if (!reqRes) { return; }
        this.model = `${reqRes.method} ${reqRes.url}\n${reqRes.reqHeadersStr}\n\n${reqRes.reqBody}`;
    }

    _message = ""
    get message() { return this._message; }
    set message(message) {
        this._message = message;
        this.invalid = !!message;
    }

    parsedModel: any

    _model: string
    get model() { return this._model; }
    set model(model) {
        this._model = model;
        try {
            this.parsedModel = this.parse(this.model);
            this.message = null;
        } catch (e) {
            this.message = e.message;
        }
    }

    parse(value: string) {
        if (!value) {
            throw new Error("Method and URL are required");
        }
        var lines = value.split(/\r\n?|\n/);

        var parts = lines.shift().split(" ");

        var method = parts[0].trim();
        if (!/^(get|post|put|delete|options|head)$/i.test(method)) {
            throw new Error(`Unknown method: ${method}`);
        };

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
            return /^[ -~]+$/.test(val) && !/[\(\)<>@,;:\\<>\/\[\]\?={} \t"]/.test(val);
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

    send(reqRes?: ReqRes) {
        var req = this.parsedModel;
        if (reqRes) {
            req = {
                url: reqRes.url,
                method:reqRes.method,
                headers:reqRes.reqHeaders,
                body:reqRes.reqBody
            };
        }

        let options = new RequestOptions({
            //AR:do not add no-cache, we do not want to spoil headers, we will clear the cache (disabling cache in nw.js seems to be buggy, see issues)
            //headers: new Headers(Object.assign({ pragma: "no-cache" }, req.headers)),
            headers: new Headers(req.headers),
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
}
