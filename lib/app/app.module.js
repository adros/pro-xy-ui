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
var platform_browser_1 = require('@angular/platform-browser');
var pipes_1 = require('./_common/pipes');
var forms_1 = require('@angular/forms');
// import { HttpModule } from '@angular/http';
require('./_common/rxjs-extensions'); //load extensions
var app_routing_1 = require('./app.routing');
var common_1 = require('@angular/common');
var app_component_1 = require('./app.component');
var home_component_1 = require('./home/home.component');
var status_component_1 = require('./status/status.component');
var config_component_1 = require('./config/config.component');
var logs_component_1 = require('./logs/logs.component');
var url_replace_component_1 = require('./url-replace/url-replace.component');
//
// import { ModalModule } from 'angular2-modal';
// import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
// import { ChartModule } from 'angular2-highcharts';
//
var socket_service_1 = require('./service/socket.service');
var config_service_1 = require('./service/config.service');
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_browser_1.BrowserModule,
                forms_1.FormsModule,
                // HttpModule,
                app_routing_1.routing,
            ],
            declarations: [
                app_component_1.AppComponent,
                config_component_1.ConfigComponent,
                home_component_1.HomeComponent,
                status_component_1.StatusComponent,
                url_replace_component_1.UrlReplaceComponent,
                logs_component_1.LogsComponent,
                //pipes:
                pipes_1.JsonPipe
            ],
            bootstrap: [app_component_1.AppComponent],
            providers: [
                { provide: common_1.APP_BASE_HREF, useValue: '/' },
                socket_service_1.SocketService,
                config_service_1.ConfigService
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
