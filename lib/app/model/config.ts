class urlReplace {
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

    get urlReplace(): urlReplace {
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
}
