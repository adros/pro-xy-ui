"use strict";
class urlReplace {}
class Config {
    constructor(obj) {
        this.isEmpty = false;
        if (obj) {
            Object.assign(this, obj);
        } else {
            this.isEmpty = true;
        }
    }
    get urlReplace() {
        var urlReplace = this["pro-xy-url-replace"];
        if (!urlReplace) {
            urlReplace = {
                missing: true
            };
        }
        if (!urlReplace.replaces) {
            urlReplace.replaces = [];
        }
        return urlReplace;
    }
    set urlReplace(urlReplace) {
        this["pro-xy-url-replace"] = urlReplace;
    }

    get autoResponder() {
        var autoResponder = this["pro-xy-auto-responder"];
        if (!autoResponder) {
            autoResponder = {
                missing: true
            };
        }
        if (!autoResponder.responses) {
            autoResponder.responses = [];
        }
        return autoResponder;
    }
    set autoResponder(autoResponder) {
        this["pro-xy-auto-responder"] = autoResponder;
    }

    get delay() {
        var delay = this["pro-xy-delay"];
        if (!delay) {
            delay = {
                missing: true
            };
        }
        if (!delay.rules) {
            delay.rules = [];
        }
        return delay;
    }
    set delay(delay) {
        this["pro-xy-delay"] = delay;
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
