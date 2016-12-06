"use strict";
const router_1 = require('@angular/router');
const config_component_1 = require('./config/config.component');
const logs_component_1 = require('./logs/logs.component');
const url_replace_component_1 = require('./url-replace/url-replace.component');
const appRoutes = [
    {
        path: 'config',
        component: config_component_1.ConfigComponent
    },
    {
        path: '',
        redirectTo: '/url-replace',
        pathMatch: 'full'
    },
    {
        path: 'url-replace',
        component: url_replace_component_1.UrlReplaceComponent
    },
    {
        path: 'logs',
        component: logs_component_1.LogsComponent
    },
];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
