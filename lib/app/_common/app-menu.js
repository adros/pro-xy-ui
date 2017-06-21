"use strict";
const path = nodeRequire("path");
const { remote, shell } = nodeRequire("electron");
const { Menu, MenuItem, app } = remote;
const LOG_FILE_LOCATION = path.join(process.env.HOME, "pro-xy-logs/pro-xy.log");
const CONFIG_LOCATION = path.join(process.env.HOME, ".pro-xyrc.json");
let mainMenu;
let globalItems = [
    new MenuItem({ label: "Reload app", click: () => { app.relaunch(); app.exit(0); } }),
    new MenuItem({ label: "Open", submenu: createOpenMenu() })
];
function openAppMenu(evt) {
    if (evt.ctrlKey) {
        return;
    }
    evt.preventDefault();
    //NTH: there seems to be no way to remove old items in electron, so recreate menu
    mainMenu && mainMenu.destroy();
    mainMenu = new Menu();
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
    let openMenu = new Menu();
    openMenu.append(new MenuItem({
        label: "Config file (in system editor)",
        click: () => shell.openItem(CONFIG_LOCATION)
    }));
    openMenu.append(new MenuItem({
        label: "Log file (in system editor)",
        click: () => shell.openItem(LOG_FILE_LOCATION)
    }));
    return openMenu;
}
