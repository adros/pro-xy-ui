import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {JsonPipe} from './_common/pipes';
import { FormsModule } from '@angular/forms';
// import { HttpModule } from '@angular/http';

import './_common/rxjs-extensions'; //load extensions

import { routing } from './app.routing';
import { APP_BASE_HREF } from '@angular/common';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { StatusComponent } from './home/status.component';
import { ConfigComponent } from './config/config.component';
import { UrlReplaceComponent } from './url-replace/url-replace.component';
//
// import { ModalModule } from 'angular2-modal';
// import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
// import { ChartModule } from 'angular2-highcharts';
//
import { SocketService } from './service/socket.service';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        // HttpModule,
        routing,
        // ModalModule.forRoot(),
        // BootstrapModalModule,
        // ChartModule,
        // DataTableModule
    ],
    declarations: [
        AppComponent,
        ConfigComponent,
        HomeComponent,
        StatusComponent,
        UrlReplaceComponent,
        //pipes:
        JsonPipe
    ],
    bootstrap: [AppComponent],
    providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        SocketService
        // ErrorHandler,
        // BookService,
        // ChartService,
        // ReadingService
    ]
})
export class AppModule {
}
