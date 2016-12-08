"use strict";
var path = nw.require("path");
var LOG_FILE_LOCATION = path.join(process.env.HOME, "pro-xy-logs/pro-xy.log");
var CONFIG_LOCATION = path.join(process.env.HOME, ".pro-xyrc.json");
function crateAppMenu() {
    var mainMenu = new nw.Menu();
    mainMenu.append(new nw.MenuItem({
        label: "Open",
        submenu: createOpenMenu()
    }));
    return mainMenu;
}
exports.crateAppMenu = crateAppMenu;
function createOpenMenu() {
    var openMenu = new nw.Menu();
    openMenu.append(new nw.MenuItem({
        label: "Config file (in system editor)",
        click: () => nw.Shell.openItem(CONFIG_LOCATION)
    }));
    openMenu.append(new nw.MenuItem({
        label: "Log file (in system editor)",
        click: () => nw.Shell.openItem(LOG_FILE_LOCATION)
    }));
    return openMenu;
}
