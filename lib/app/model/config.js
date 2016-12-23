"use strict";
class urlReplace {
}
class Config {
    constructor(obj) {
        if (obj) {
            Object.assign(this, obj);
        }
    }
    get urlReplace() {
        var urlReplace = this["pro-xy-url-replace"];
        if (!urlReplace) {
            urlReplace = { missing: true };
        }
        if (!urlReplace.replaces) {
            urlReplace.replaces = [];
        }
        return urlReplace;
    }
    get autoResponder() {
        var autoResponder = this["pro-xy-auto-responder"];
        if (!autoResponder) {
            autoResponder = { missing: true };
        }
        if (!autoResponder.responses) {
            autoResponder.responses = [];
        }
        return autoResponder;
    }
    get delay() {
        var delay = this["pro-xy-delay"];
        if (!delay) {
            delay = { missing: true };
        }
        if (!delay.rules) {
            delay.rules = [];
        }
        return delay;
    }
    addAutoResponse(response) {
        var autoResponder = this.autoResponder;
        if (autoResponder.missing) {
            autoResponder = this["pro-xy-auto-responder"] = {
                disabled: false,
                responses: []
            };
        }
        if (!autoResponder.responses) {
            autoResponder.responses = [];
        }
        autoResponder.responses.push(response);
    }
}
exports.Config = Config;
