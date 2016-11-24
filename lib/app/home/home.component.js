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
var HomeComponent = (function () {
    function HomeComponent(socketService) {
        this.socketService = socketService;
        this._requestsCache = [];
        this.maxSize = 20;
    }
    HomeComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.requestsObservable = this.socketService.getRequestsObservable()
            .filter(function (req) { return req && req.origUrl; })
            .map(function (req) {
            var reqs = _this._requestsCache;
            reqs.push(req);
            reqs.length > _this.maxSize && reqs.shift();
            return reqs.slice(0);
        });
    };
    HomeComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            templateUrl: 'home.component.html',
            styleUrls: ['home.component.css'],
            selector: 'home'
        }), 
        __metadata('design:paramtypes', [socket_service_1.SocketService])
    ], HomeComponent);
    return HomeComponent;
}());
exports.HomeComponent = HomeComponent;