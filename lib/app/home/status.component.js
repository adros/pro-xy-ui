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
var StatusComponent = (function () {
    function StatusComponent(socketService) {
        this.socketService = socketService;
        this._logs = [];
        this.bufferSize = 20;
    }
    StatusComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.logs = this.socketService.getLogsObservable()
            .map(function (logStr) {
            var logs = _this._logs;
            logs.push(logStr);
            logs.length > _this.bufferSize && logs.shift();
            return logs.slice(0);
        });
    };
    StatusComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            templateUrl: 'status.component.html',
            // styleUrls: ['home.component.css'],
            selector: 'status'
        }), 
        __metadata('design:paramtypes', [socket_service_1.SocketService])
    ], StatusComponent);
    return StatusComponent;
}());
exports.StatusComponent = StatusComponent;
