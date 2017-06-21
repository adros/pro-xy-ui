const {app, BrowserWindow} = require("electron");
const path = require("path");
const url = require("url");

// Keep a global reference of the window object, if you don"t, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow() {
	// Create the browser window.
	win = new BrowserWindow({});

	// and load the index.html of the app.
	win.loadURL(url.format({
		pathname: path.join(__dirname, "index.html"),
		protocol: "file:",
		slashes: true
	}));

	//win.webContents.openDevTools();
	win.maximize();
	win.on("closed", () => (win = null));
}
app.on("ready", createWindow);
app.on("window-all-closed", () => process.platform !== "darwin" && app.quit());
app.on("activate", () => win === null && createWindow());
