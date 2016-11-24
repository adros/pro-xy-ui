import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfigComponent } from './config/config.component';
import { HomeComponent } from './home/home.component';
import { LogsComponent } from './logs/logs.component';
import { UrlReplaceComponent } from './url-replace/url-replace.component';

const appRoutes: Routes = [
    {
        path: 'config',
        component: ConfigComponent
    },
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'url-replace',
        component: UrlReplaceComponent
    },
    {
        path: 'logs',
        component: LogsComponent
    },
    // {
    //     path: 'books/:id',
    //     component: BookDetailComponent
    // },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
