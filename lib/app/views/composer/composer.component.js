"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
const core_1 = require("@angular/core");
const http_1 = require("@angular/http");
var app = nw.require('nw.gui').App;
let ComposerComponent = class ComposerComponent {
    constructor(http) {
        this.http = http;
        this.invalid = false;
        this.model = 'GET http://sample.foo/bar?baz\ncontent-type: application/json\naccept: */*\n\n{"sample":1}';
    }
    ngOnInit() {
    }
    hBlur() {
        if (this.invalid) {
            return;
        }
        //this.model = JSON.stringify(JSON.parse(this.model), null, 4);
    }
    send() {
        //TODO read port from config
        app.setProxyConfig("http=localhost:8000,direct://;direct://");
        this.http.get("http://registry.npmjs.org/pro-xy-ui?cacheBust=" + Math.random())
            .toPromise()
            .then(response => console.log(response))
            .catch(err => console.error(err))
            .then(() => app.setProxyConfig(""));
    }
};
ComposerComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'composer.component.html',
        styleUrls: ['composer.component.css'],
        selector: 'composer',
        host: { class: 'flex-grow' },
        changeDetection: core_1.ChangeDetectionStrategy.OnPush
    }),
    __metadata("design:paramtypes", [http_1.Http])
], ComposerComponent);
exports.ComposerComponent = ComposerComponent;
