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
const platform_browser_1 = require("@angular/platform-browser");
const pipes_1 = require("./_common/pipes");
const forms_1 = require("@angular/forms");
// import { HttpModule } from '@angular/http';
require("./_common/rxjs-extensions"); //load extensions
const app_routing_1 = require("./app.routing");
const common_1 = require("@angular/common");
const app_component_1 = require("./app.component");
const home_component_1 = require("./home/home.component");
const status_component_1 = require("./status/status.component");
const config_component_1 = require("./config/config.component");
const logs_component_1 = require("./logs/logs.component");
const url_replace_component_1 = require("./url-replace/url-replace.component");
//
// import { ModalModule } from 'angular2-modal';
// import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
// import { ChartModule } from 'angular2-highcharts';
//
const socket_service_1 = require("./service/socket.service");
const traffic_service_1 = require("./service/traffic.service");
const config_service_1 = require("./service/config.service");
let AppModule = class AppModule {
};
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
            config_service_1.ConfigService,
            traffic_service_1.TrafficService
        ]
    }),
    __metadata("design:paramtypes", [])
], AppModule);
exports.AppModule = AppModule;
