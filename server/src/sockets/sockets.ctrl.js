const handleTestMessage = (socket, msg) => {
  console.log("Received:", msg);
  io.emit(`[SocketCtrl] testMessage from ${socket.id}:`, msg);
};

const handleSendLocation = (socket, coords) => {
  console.log(`[SocketCtrl] GPS from ${socket.id}:`, coords);
};

const handleDisconnect = (socket, reason) => {
  console.log(`[SocketCtrl] ${socket.id} disconnected: ${reason}`);
};

module.exports = {
  handleTestMessage,
  handleSendLocation,
  handleDisconnect,
};
