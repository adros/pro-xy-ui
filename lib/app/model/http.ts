export class Req {
    constructor(obj) {
        if (obj) {
            Object.assign(this, obj);
        }
    }
    id: number;
    url: string;
    origUrl: string;
    method: string;
}

export class Res {
    constructor(obj) {
        if (obj) {
            Object.assign(this, obj);
        }
    }
    id: number;
    statusCode: number;
    headers: { [key: string]: any }
}

export class ReqRes {

    _res: Res

    constructor(private _req: Req) { }

    get complete(): boolean {
        return !!this.res;
    }

    set res(res: Res) {
        this._res = res;
    }

    get res() { return this._res; }
    get req() { return this._req; }
}

export function toReq(obj) {
    return new Req(obj);
}

export function toRes(obj) {
    return new Res(obj);
}
