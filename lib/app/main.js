"use strict";
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var app_module_1 = require('./app.module');
var resourceLoaderImplProto = platform_browser_dynamic_1.__platform_browser_dynamic_private__.ResourceLoaderImpl.prototype;
var getOrig = resourceLoaderImplProto.get;
resourceLoaderImplProto.get = function (url) {
    return getOrig.call(this, /^\//.test(url) ? "file://" + url : url);
};
var platform = platform_browser_dynamic_1.platformBrowserDynamic();
platform.bootstrapModule(app_module_1.AppModule);
