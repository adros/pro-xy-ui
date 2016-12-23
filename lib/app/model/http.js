"use strict";
var http = nw.require("http");
var zlib = nw.require("zlib");
var stringify = nw.require("json-stable-stringify");
const core_1 = require('@angular/core');
(function (Update) {
    Update[Update["RES_HEADERS"] = 0] = "RES_HEADERS";
    Update[Update["REQ_BODY"] = 1] = "REQ_BODY";
    Update[Update["RES_BODY"] = 2] = "RES_BODY";
})(exports.Update || (exports.Update = {}));
var Update = exports.Update;
class ReqRes {
    constructor(_req) {
        this._req = _req;
        this._reqBody = [];
        this._resBody = [];
        this.reqBody = "";
        this.resBody = "";
        this.resFlags = "";
        this.reqFlags = "";
        this.updated = new core_1.EventEmitter();
        this.isFinished = false;
    }
    set res(res) {
        this._res = res;
        this.updated.emit(Update.RES_HEADERS);
    }
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
    get reqHeaders() { return this._req && this._req.headers || {}; }
    get resHeaders() { return this._res && this._res.headers || {}; }
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
    addReqChunk(chunk) {
        chunk && this._reqBody.push(ab2b(chunk));
    }
    addResChunk(chunk) {
        chunk && this._resBody.push(ab2b(chunk));
    }
    endReq() {
        this.reqBody = Buffer.concat(this._reqBody).toString();
        if (this.reqBody && this.reqContentType == "application/json") {
            try {
                this.reqBody = stringify(JSON.parse(this.reqBody), { space: 2 });
                this.reqFlags += "[JSON formatted & sorted]";
            }
            catch (e) {
                this.reqFlags += "[UNPARSABLE JSON]";
            }
        }
        this.updated.emit(Update.REQ_BODY);
    }
    endRes() {
        var buff = Buffer.concat(this._resBody);
        if (this.getResHeader("content-encoding") == "gzip") {
            this.resFlags += "[GZIP decoded]";
            buff = zlib.gunzipSync(buff);
        }
        this.resBody = buff.toString('utf8');
        if (this.resBody && this.resContentType == "application/json") {
            try {
                this.resBody = stringify(JSON.parse(this.resBody), { space: 2 });
                this.resFlags += "[JSON formatted & sorted]";
            }
            catch (e) {
                this.resFlags += "[UNPARSABLE JSON]";
            }
        }
        this.updated.emit(Update.RES_BODY);
        this.isFinished = true;
    }
    toString() {
        return `${this.method} ${this.url}\n${this.reqHeadersStr}\n\n${this.reqBody}\n\n${this.statusStr}\n${this.resHeadersStr}\n\n${this.resBody}`;
    }
}
exports.ReqRes = ReqRes;
function ab2b(ab) {
    var buffer = new Buffer(ab.byteLength);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) {
        buffer[i] = view[i];
    }
    return buffer;
}
