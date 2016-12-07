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
let ConfigComponent = class ConfigComponent {
    constructor(socketService) {
        this.socketService = socketService;
    }
    ngOnInit() {
        this.configObservable = this.socketService.getConfigObservable();
    }
    save() {
        var confObj;
        try {
            confObj = JSON.parse(this.updatedConfig);
        }
        catch (e) {
            alert("Config is not valid JSON");
        }
        this.socketService.replaceConfig(confObj);
    }
    hChange(value) {
        this.updatedConfig = value;
    }
};
ConfigComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'config.component.html',
        styleUrls: ['config.component.css'],
        selector: 'config',
        host: { class: 'flex-grow' }
    }), 
    __metadata('design:paramtypes', [socket_service_1.SocketService])
], ConfigComponent);
exports.ConfigComponent = ConfigComponent;
