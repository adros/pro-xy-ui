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
var core_1 = require('@angular/core');
var JsonHtmlPipe = (function () {
    function JsonHtmlPipe() {
    }
    JsonHtmlPipe.prototype.transform = function (val) {
        return JSON.stringify(val, null, 2)
            .replace(' ', '&nbsp;')
            .replace('\n', '<br/>');
    };
    JsonHtmlPipe = __decorate([
        core_1.Pipe({
            name: 'jsonhtml'
        }), 
        __metadata('design:paramtypes', [])
    ], JsonHtmlPipe);
    return JsonHtmlPipe;
}());
exports.JsonHtmlPipe = JsonHtmlPipe;
var JsonPipe = (function () {
    function JsonPipe() {
    }
    JsonPipe.prototype.transform = function (val) {
        return JSON.stringify(val, null, 2);
    };
    JsonPipe = __decorate([
        core_1.Pipe({
            name: 'json'
        }), 
        __metadata('design:paramtypes', [])
    ], JsonPipe);
    return JsonPipe;
}());
exports.JsonPipe = JsonPipe;
