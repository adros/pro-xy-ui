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
const platform_browser_1 = require('@angular/platform-browser');
const material_1 = require('@angular/material');
const pipes_1 = require('./_common/pipes');
const forms_1 = require('@angular/forms');
// import { HttpModule } from '@angular/http';
require('./_common/rxjs-extensions'); //load extensions
const common_1 = require('@angular/common');
const app_component_1 = require('./app.component');
const requests_component_1 = require('./views/requests/requests.component');
const request_row_component_1 = require('./views/requests/request-row.component');
const status_component_1 = require('./views/status/status.component');
const config_component_1 = require('./views/config/config.component');
const diff_dialog_component_1 = require('./views/config/diff-dialog.component');
const logs_component_1 = require('./views/logs/logs.component');
const connection_component_1 = require('./views/connection/connection.component');
const url_replace_component_1 = require('./views/url-replace/url-replace.component');
const inspector_component_1 = require('./views/inspector/inspector.component');
const auto_responder_component_1 = require('./views/auto-responder/auto-responder.component');
const delay_component_1 = require('./views/delay/delay.component');
const socket_service_1 = require('./service/socket.service');
const traffic_service_1 = require('./service/traffic.service');
const config_service_1 = require('./service/config.service');
let AppModule = class AppModule {
};
AppModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            forms_1.FormsModule,
            // HttpModule,
            //routing,
            material_1.MaterialModule.forRoot()
        ],
        declarations: [
            app_component_1.AppComponent,
            config_component_1.ConfigComponent,
            requests_component_1.RequestsComponent,
            status_component_1.StatusComponent,
            url_replace_component_1.UrlReplaceComponent,
            logs_component_1.LogsComponent,
            connection_component_1.ConnectionComponent,
            inspector_component_1.InspectorComponent,
            request_row_component_1.RequestsRowComponent,
            auto_responder_component_1.AutoResponder,
            delay_component_1.DelayComponent,
            //pipes:
            pipes_1.JsonPipe,
            //dialogs
            diff_dialog_component_1.DiffDialog
        ],
        entryComponents: [
            diff_dialog_component_1.DiffDialog
        ],
        bootstrap: [app_component_1.AppComponent],
        providers: [
            { provide: common_1.APP_BASE_HREF, useValue: '/' },
            socket_service_1.SocketService,
            config_service_1.ConfigService,
            traffic_service_1.TrafficService
        ]
    }), 
    __metadata('design:paramtypes', [])
], AppModule);
exports.AppModule = AppModule;
