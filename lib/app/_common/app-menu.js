"use strict";
var path = nw.require("path");
var LOG_FILE_LOCATION = path.join(process.env.HOME, "pro-xy-logs/pro-xy.log");
var CONFIG_LOCATION = path.join(process.env.HOME, ".pro-xyrc.json");
var mainMenu;
var globalItems = [
    new nw.MenuItem({ label: "Reload app", click: () => chrome.runtime.reload() }),
    new nw.MenuItem({ label: "Open", submenu: createOpenMenu() })
];
function openAppMenu(evt) {
    if (evt.ctrlKey) {
        return;
    }
    evt.preventDefault();
    if (!mainMenu) {
        mainMenu = new nw.Menu();
    }
    while (mainMenu.items.length) {
        mainMenu.removeAt(0);
    }
    if (evt.menuItems) {
        evt.menuItems.forEach(item => mainMenu.append(item));
    }
    if (!evt.preventGlobalItems) {
        globalItems.forEach(item => mainMenu.append(item));
    }
    mainMenu.popup(evt.pageX, evt.pageY);
}
exports.openAppMenu = openAppMenu;
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
