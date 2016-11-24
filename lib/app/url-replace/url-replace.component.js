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
var socket_service_1 = require('../service/socket.service');
var UrlReplaceComponent = (function () {
    function UrlReplaceComponent(socketService) {
        this.socketService = socketService;
    }
    UrlReplaceComponent.prototype.ngOnInit = function () {
        this.configObservable = this.socketService.getConfigObservable();
    };
    UrlReplaceComponent.prototype.hChange = function (item, index) {
        item.disabled = !item.disabled; //changed by reference
        this.socketService.replaceConfig(this.configObservable.value);
    };
    UrlReplaceComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            templateUrl: 'url-replace.component.html',
            styleUrls: ['url-replace.component.css'],
            selector: 'url-replace'
        }), 
        __metadata('design:paramtypes', [socket_service_1.SocketService])
    ], UrlReplaceComponent);
    return UrlReplaceComponent;
}());
exports.UrlReplaceComponent = UrlReplaceComponent;
