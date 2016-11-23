require("reflect-metadata");
require("zone.js");

var platformBrowserDynamic = require("@angular/platform-browser-dynamic");
var resourceLoaderImplProto = platformBrowserDynamic.__platform_browser_dynamic_private__.ResourceLoaderImpl.prototype;
var getOrig = resourceLoaderImplProto.get;
resourceLoaderImplProto.get = function(url) {
	return getOrig.call(this, /^\//.test(url) ? "file://" + url : url);
};

var platform = platformBrowserDynamic.platformBrowserDynamic();
var AppModule = require("./lib/app/app.module").AppModule;

platform.bootstrapModule(AppModule)
.then(() => console.log("Angular loaded"))
.catch((err) => console.error(err));

window.onerror = function() {
	console.log("Errroooor", arguments);
};
