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
    get complete() {
        return !!this.res;
    }
    set res(res) {
        this._res = res;
    }
    get res() { return this._res; }
    get req() { return this._req; }
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
