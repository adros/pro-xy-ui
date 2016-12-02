"use strict";
class ProxyUrlReplace {
}
class Config {
    constructor(obj) {
        if (obj) {
            Object.assign(this, obj);
        }
    }
    get proxyUrlReplace() {
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
exports.Config = Config;
function fromObject(obj) {
    return new Config(obj);
}
exports.fromObject = fromObject;
