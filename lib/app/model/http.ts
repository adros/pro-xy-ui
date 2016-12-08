var http = nw.require("http");
var zlib = nw.require("zlib");

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

    _reqBody = []
    _resBody = []

    reqBody: string = ""
    resBody: string = ""

    resFlags: string = ""
    reqFlags: string = ""

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

    get reqContentType() {
        var ct = this.getReqHeader('content-type');
        return ct && ct.split(";")[0];
    }
    get resContentType() {
        var ct = this.getResHeader('content-type');
        return ct && ct.split(";")[0];
    }

    get reqHeaders() { return this._req && this._req.headers || {} }
    get resHeaders() { return this._res && this._res.headers || {} }

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
                this.reqBody = JSON.stringify(JSON.parse(this.reqBody), null, 2);
                this.reqFlags += "[JSON formatted]";
            } catch (e) {
                this.reqFlags += "[UNPARSABLE JSON]";
            }
        }
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
                this.resBody = JSON.stringify(JSON.parse(this.resBody), null, 2);
                this.resFlags += "[JSON formatted]";
            } catch (e) {
                this.resFlags += "[UNPARSABLE JSON]";
            }
        }
    }

    toString() {
        return `${this.url}\n${this.reqHeadersStr}\n\n${this.reqBody}\n\n${this.statusStr}\n${this.resHeadersStr}\n\n${this.resBody}`;
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

export function toReq(obj) {
    return new Req(obj);
}

export function toRes(obj) {
    return new Res(obj);
}
