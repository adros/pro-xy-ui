"use strict";
class Req {
    constructor(obj) {
        if (obj) {
            Object.assign(this, obj);
        }
    }
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
    getResHeader(name) {
        return this._res && this._res.headers && this._res.headers[name];
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
