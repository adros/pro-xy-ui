class ProxyUrlReplace {
    disabled: boolean;
    replaces: { name: string, pattern: string, replacement: string, disabled: boolean }[];
    replaceBackHeaders: string[]
}


export class Config {
    [key: string]: any;

    constructor(obj?) {
        if (obj) {
            Object.assign(this, obj);
        }
    }

    get proxyUrlReplace(): ProxyUrlReplace {
        var proxyUrlReplace = this["pro-xy-url-replace"];
        if (!proxyUrlReplace) {
            proxyUrlReplace = {};
        }
        if (!proxyUrlReplace.replaces) {
            proxyUrlReplace.replaces = [];
        }
        return proxyUrlReplace;
    }
}
