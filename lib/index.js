var socketIO = require("socket.io");
var logger = require("log4js").getLogger("pro-xy-ws-api");

var config;

function init(proxy) {
	proxy.on("serverstarted", setupSocketIO);
	config = proxy.getConfig();
}

function exec(proxy) {
	proxy.on("serverstarted", setupSocketIO);
}

function setupSocketIO(httpServer) {
	var io = socketIO(httpServer);
	io.on("connection", handleConnection);
	logger.info("IO was setup on httpServer");
}

function handleConnection(socket) {
	logger.debug(`User connected "${socket}", sending config`);
	socket.emit("config", config);
}

module.exports = {
	init,
	exec
};
