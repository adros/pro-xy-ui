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
var core_1 = require("@angular/core");
var config_defaultConfig_1 = require("./config.defaultConfig");
var path = nw.require("path");
var fs = nw.require("fs");
var ConfigService = (function () {
    function ConfigService() {
        this.DEFAULT_PORT = 8000;
        this.CONFIG_LOCATION = path.join(process.env.HOME, ".pro-xyrc.json");
    }
    ConfigService.prototype.configExists = function () {
        return fs.existsSync(this.CONFIG_LOCATION);
    };
    ConfigService.prototype.getConfig = function () {
        if (!this.configExists()) {
            throw new Error("Config file not found: " + this.CONFIG_LOCATION);
        }
        //not using require because JSON may have changed (and we need to read is again)
        var configJson = fs.readFileSync(this.CONFIG_LOCATION, "utf8");
        try {
            return JSON.parse(configJson);
        }
        catch (err) {
            throw new Error("File '" + this.CONFIG_LOCATION + "' is corrupted: '" + err.message + "'");
        }
    };
    ConfigService.prototype.getDefaultConfig = function () {
        return config_defaultConfig_1.default;
    };
    ConfigService.prototype.createDefaultConfig = function () {
        return fs.writeFileSync(this.CONFIG_LOCATION, JSON.stringify(this.getDefaultConfig(), null, "\t"));
    };
    ConfigService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], ConfigService);
    return ConfigService;
}());
exports.ConfigService = ConfigService;
