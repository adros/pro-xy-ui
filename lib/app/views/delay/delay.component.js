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
const socket_service_1 = require('../../service/socket.service');
const config_list_base_1 = require('../config-list-base');
let DelayComponent = class DelayComponent extends config_list_base_1.ConfigListBase {
    //TODO: how can we move this to parent?
    constructor(socketService) {
        super();
        this.configProperty = "delay";
        this.socketService = socketService;
    }
};
DelayComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'delay.component.html',
        styleUrls: ['delay.component.css'],
        selector: 'delay',
        changeDetection: core_1.ChangeDetectionStrategy.OnPush
    }), 
    __metadata('design:paramtypes', [socket_service_1.SocketService])
], DelayComponent);
exports.DelayComponent = DelayComponent;
