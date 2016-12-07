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
let StatusComponent = class StatusComponent {
    constructor(socketService, rootElement) {
        this.socketService = socketService;
        this.rootElement = rootElement;
        this.bufferSize = 20;
    }
    ngOnInit() {
        this.logs = this.socketService.getLogsObservable()
            .scan((arr, logStr) => {
            arr.push(logStr);
            return arr.slice(-1 * this.bufferSize);
        }, []);
    }
    toggle() {
        this.rootElement.nativeElement.classList.toggle("minimized");
    }
};
StatusComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'status.component.html',
        styleUrls: ['status.component.css'],
        selector: 'status'
    }), 
    __metadata('design:paramtypes', [socket_service_1.SocketService, core_1.ElementRef])
], StatusComponent);
exports.StatusComponent = StatusComponent;
