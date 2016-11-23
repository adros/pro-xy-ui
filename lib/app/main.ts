import { platformBrowserDynamic, __platform_browser_dynamic_private__ } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';

var resourceLoaderImplProto = __platform_browser_dynamic_private__.ResourceLoaderImpl.prototype;
var getOrig = resourceLoaderImplProto.get;
resourceLoaderImplProto.get = function(url) {
    return getOrig.call(this, /^\//.test(url) ? "file://" + url : url);
};

const platform = platformBrowserDynamic();
platform.bootstrapModule(AppModule);
