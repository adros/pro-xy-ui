import { Injectable } from "@angular/core";
import defaultConfig from "./config.defaultConfig";
var path = nodeRequire("path");
var fs = nodeRequire("fs");

@Injectable()
export class ConfigService {

    DEFAULT_PORT = 8000
    CONFIG_LOCATION = path.join(process.env.HOME, ".pro-xyrc.json");

    configExists() {
        return fs.existsSync(this.CONFIG_LOCATION);
    }

    getConfig() {
        if (!this.configExists()) {
            throw new Error(`Config file not found: ${this.CONFIG_LOCATION}`);
        }

        //not using require because JSON may have changed (and we need to read is again)
        var configJson = fs.readFileSync(this.CONFIG_LOCATION, "utf8")
        try {
            return JSON.parse(configJson);
        } catch (err) {
            throw new Error(`File '${this.CONFIG_LOCATION}' is corrupted: '${err.message}'`);
        }
    }

    getDefaultConfig() {
        return defaultConfig;
    }

    createDefaultConfig() {
        return fs.writeFileSync(this.CONFIG_LOCATION, JSON.stringify(this.getDefaultConfig(), null, "\t"));
    }

}
