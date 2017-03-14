"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    "port": 8000,
    "logLevel": "DEBUG",
    "plugins": [
        "pro-xy-header-replace",
        "pro-xy-cookie-replace",
        "pro-xy-url-replace",
        "pro-xy-ws-api",
        "pro-xy-delay",
        "pro-xy-auto-responder"
    ],
    "pro-xy-url-replace": {
        "disabled": false,
        "replaces": [
            {
                "name": "my-repalce",
                "pattern": "//localhost:..../something/svc/",
                "replacement": "//some.server.com:8080/something/svc/",
                "disabled": false
            }
        ],
        "replaceBackHeaders": [
            "location",
            "link"
        ]
    },
    "pro-xy-auto-responder": {
        "disabled": true,
        "responses": [
            {
                "disabled": false,
                "urlPattern": "ADD SOME PATTERN",
                "status": 200,
                "contentType": "text/plain",
                "target": "/absolute/path/or/relative/to/HOME/.auto-respond/"
            }
        ]
    },
    "pro-xy-cookie-replace": {
        "disabled": true,
        "replaces": [
            {
                "urlPattern": "ADD SOME PATTERN",
                "pattern": "foo",
                "replacement": "bar"
            }
        ]
    },
    "pro-xy-header-replace": {
        "disabled": true,
        "replaces": [
            {
                "urlPattern": "ADD SOME PATTERN",
                "request": false,
                "response": true,
                "header": "Content-Type",
                "pattern": "text/html",
                "replacement": "text/plain"
            }
        ]
    },
    "pro-xy-delay": {
        "disabled": false,
        "rules": [
            {
                "urlPattern": ".*",
                "delay": 2000,
                "disabled": false
            }
        ]
    }
};
