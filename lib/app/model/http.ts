var http = nw.require("http");

export class Req {
    constructor(obj) {
        if (obj) {
            Object.assign(this, obj);
        }
    }
    id: number;
    url: string;
    origUrl: string;
    method: string;;
    headers: { [key: string]: string }
}

export class Res {
    constructor(obj) {
        if (obj) {
            Object.assign(this, obj);
        }
    }
    id: number;
    statusCode: number;
    headers: { [key: string]: string }
}

export class ReqRes {

    _res: Res

    constructor(private _req: Req) { }

    set res(res: Res) {
        this._res = res;
    }

    get isComplete(): boolean { return !!this.res; }

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

    get reqHeaders() { return this._req && this._req.headers || {} }
    get resHeaders() { return this._res && this._res.headers || {} }

    getResHeader(name) {
        return this.resHeaders[name];
    }

    getReqHeader(name) {
        return this.reqHeaders[name];
    }

    toString() {
        var reqHeadersStr = Object.keys(this.reqHeaders).map(name => `${name}: ${this.reqHeaders[name]}`).join("\n");
        var resHeadersStr = Object.keys(this.resHeaders).map(name => `${name}: ${this.resHeaders[name]}`).join("\n");
        var statusStr = this.statusCode ? `${this.statusCode} ${http.STATUS_CODES[this.statusCode]}` : ""

        return `${this.url}\n${reqHeadersStr}\n\n${statusStr}\n${resHeadersStr}`;
    }
}

export function toReq(obj) {
    return new Req(obj);
}

export function toRes(obj) {
    return new Res(obj);
}
