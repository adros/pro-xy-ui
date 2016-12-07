"use strict";
var http = nw.require("http");
class Req {
    constructor(obj) {
        if (obj) {
            Object.assign(this, obj);
        }
    }
    ;
}
exports.Req = Req;
class Res {
    constructor(obj) {
        if (obj) {
            Object.assign(this, obj);
        }
    }
}
exports.Res = Res;
class ReqRes {
    constructor(_req) {
        this._req = _req;
    }
    set res(res) {
        this._res = res;
    }
    get isComplete() { return !!this.res; }
    get id() { return this._req && this._req.id; }
    get url() { return this._req && this._req.url; }
    get origUrl() { return this._req && this._req.origUrl; }
    get method() { return this._req && this._req.method; }
    get isReplaced() { return this._req && !!this._req.origUrl; }
    get statusCode() { return this._res && this._res.statusCode; }
    get resContentType() {
        var ct = this.getResHeader('content-type');
        return ct && ct.split(";")[0];
    }
    get reqHeaders() { return this._req && this._req.headers || {}; }
    get resHeaders() { return this._res && this._res.headers || {}; }
    getResHeader(name) {
        return this.resHeaders[name];
    }
    getReqHeader(name) {
        return this.reqHeaders[name];
    }
    toString() {
        var reqHeadersStr = Object.keys(this.reqHeaders).map(name => `${name}: ${this.reqHeaders[name]}`).join("\n");
        var resHeadersStr = Object.keys(this.resHeaders).map(name => `${name}: ${this.resHeaders[name]}`).join("\n");
        var statusStr = this.statusCode ? `${this.statusCode} ${http.STATUS_CODES[this.statusCode]}` : "";
        return `${this.url}\n${reqHeadersStr}\n\n${statusStr}\n${resHeadersStr}`;
    }
}
exports.ReqRes = ReqRes;
function toReq(obj) {
    return new Req(obj);
}
exports.toReq = toReq;
function toRes(obj) {
    return new Res(obj);
}
exports.toRes = toRes;
