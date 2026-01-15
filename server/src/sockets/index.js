const ctrl = require("./sockets.ctrl");

module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log(`[Socket] Connected: ${socket.id}`);

    socket.onAny((eventName, ...args) => {
      console.log(
        `[Socket DEBUG] Event received from ${socket.id}: Event Name = '${eventName}', Arguments =`,
        args
      );
    });

    socket.on("testMessage", (msg) => {
      ctrl.handleTestMessage(socket, msg);
    });

    socket.on("sendLocation", (coords) => {
      ctrl.handleSendLocation(socket, coords);
    });

    socket.on("getHistory", (targetId) => {
      ctrl.handleGetHistory(socket, targetId || socket.id);
    });

    socket.on("getAllLastLocations", () => {
      ctrl.handleGetAllLastLocations(socket);
    });

    socket.on("disconnect", (reason) => {
      ctrl.handleDisconnect(socket, reason);
    });

    socket.on("error", (error) => {
      console.error(`[Socket] Error for ${socket.id}:`, error);
    });
  });

  console.log("[Socket] Socket.IO event listeners set up.");
};
