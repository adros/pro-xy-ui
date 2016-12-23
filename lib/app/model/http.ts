var http = nw.require("http");
var zlib = nw.require("zlib");
var stringify = nw.require("json-stable-stringify");
import {  EventEmitter } from '@angular/core';


export interface Req {
    id: number;
    url: string;
    method: string;
    headers: { [key: string]: string }
}

export interface Res {
    id: number;
    statusCode: number;
    headers: { [key: string]: string }
}

export enum Update {
    RES_HEADERS,
    REQ_BODY,
    RES_BODY
}

export class ReqRes {

    _res: Res

    _reqBody = []
    _resBody = []

    reqBody: string = ""
    resBody: string = ""

    resFlags: string = ""
    reqFlags: string = ""

    updated = new EventEmitter<Update>();

    constructor(private _req: Req) { }

    set res(res: Res) {
        this._res = res;
        this.updated.emit(Update.RES_HEADERS);
    }

    isFinished = false

    get id() { return this._req && this._req.id; }
    get url() { return this._req && this._req.url; }
    get method() { return this._req && this._req.method; }
    get isReplaced() { return !!this.getReqHeader("x-pro-xy-url-replace"); }

    get statusCode() { return this._res && this._res.statusCode; }

    get reqContentType() {
        var ct = this.getReqHeader('content-type');
        return ct && ct.split(";")[0];
    }
    get resContentType() {
        var ct = this.getResHeader('content-type');
        return ct && ct.split(";")[0];
    }

    get reqHeaders() { return Object.assign({}, this._req && this._req.headers); }
    get resHeaders() { return Object.assign({}, this._res && this._res.headers); }

    get reqHeadersStr() {
        return Object.keys(this.reqHeaders).map(name => `${name}: ${this.reqHeaders[name]}`).join("\n");
    }
    get resHeadersStr() {
        return Object.keys(this.resHeaders).map(name => `${name}: ${this.resHeaders[name]}`).join("\n");
    }
    get statusStr() {
        return this.statusCode ? `${this.statusCode} ${http.STATUS_CODES[this.statusCode]}` : "";
    }

    getResHeader(name) {
        return this.resHeaders[name];
    }

    getReqHeader(name) {
        return this.reqHeaders[name];
    }

    addReqChunk(chunk: ArrayBuffer) {
        chunk && this._reqBody.push(ab2b(chunk));
    }

    addResChunk(chunk: ArrayBuffer) {
        chunk && this._resBody.push(ab2b(chunk));
    }

    endReq() {
        this.reqBody = Buffer.concat(this._reqBody).toString();
        if (this.reqBody && this.reqContentType == "application/json") {
            try {
                this.reqBody = stringify(JSON.parse(this.reqBody), { space: 2 });
                this.reqFlags += "[JSON formatted & sorted]";
            } catch (e) {
                this.reqFlags += "[UNPARSABLE JSON]";
            }
        }
        this.updated.emit(Update.REQ_BODY);
    }

    endRes() {
        var buff = Buffer.concat(this._resBody);
        if (this.isGzip) {
            this.resFlags += "[GZIP decoded]";
            buff = zlib.gunzipSync(buff);
        }
        this.resBody = buff.toString('utf8');
        if (this.resBody && this.resContentType == "application/json") {
            try {
                this.resBody = stringify(JSON.parse(this.resBody), { space: 2 });
                this.resFlags += "[JSON formatted & sorted]";
            } catch (e) {
                this.resFlags += "[UNPARSABLE JSON]";
            }
        }
        this.updated.emit(Update.RES_BODY);
        this.isFinished = true;
    }

    get isGzip() {
        return this.getResHeader("content-encoding") == "gzip";
    }

    toString() {
        return `${this.method} ${this.url}\n${this.reqHeadersStr}\n\n${this.reqBody}\n\n${this.statusStr}\n${this.resHeadersStr}\n\n${this.resBody}`;
    }
}

function ab2b(ab) {
    var buffer = new Buffer(ab.byteLength);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) {
        buffer[i] = view[i];
    }
    return buffer;
}
