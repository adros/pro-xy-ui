"use strict";
var router_1 = require('@angular/router');
var config_component_1 = require('./config/config.component');
var home_component_1 = require('./home/home.component');
var logs_component_1 = require('./logs/logs.component');
var url_replace_component_1 = require('./url-replace/url-replace.component');
var appRoutes = [
    {
        path: 'config',
        component: config_component_1.ConfigComponent
    },
    {
        path: '',
        component: home_component_1.HomeComponent
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
