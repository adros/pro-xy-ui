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
const core_1 = require('@angular/core');
const http_1 = require('../../model/http');
let InspectorComponent = class InspectorComponent {
    constructor() {
    }
    ngOnInit() { }
    selectAll(evt) {
        var sel = window.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.selectNodeContents(evt.target);
        sel.addRange(range);
    }
};
__decorate([
    core_1.Input(), 
    __metadata('design:type', http_1.ReqRes)
], InspectorComponent.prototype, "reqRes", void 0);
InspectorComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'inspector.component.html',
        styleUrls: ['inspector.component.css'],
        selector: 'inspector',
        host: { class: 'flex-grow' }
    }), 
    __metadata('design:paramtypes', [])
], InspectorComponent);
exports.InspectorComponent = InspectorComponent;
