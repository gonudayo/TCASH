const LocationModel = require("../models/location.model");

const handleTestMessage = (socket, msg) => {
  console.log("Received:", msg);
  io.emit(`[SocketCtrl] testMessage from ${socket.id}:`, msg);
};

const handleSendLocation = (socket, coords) => {
  LocationModel.addLocation(socket.id, coords);

  console.log(`[SocketCtrl] Saved for ${socket.id}:`, coords.lat, coords.lng);
};

const handleGetHistory = (socket, targetId) => {
  const history = LocationModel.getHistory(targetId);

  socket.emit("location_history", { id: targetId, history });
};

const handleGetAllLastLocations = (socket) => {
  const history = LocationModel.getAllLastLocations();

  socket.emit("all_last_locations", history);
};

const handleDisconnect = (socket, reason) => {
  // LocationModel.removeUser(socket.id);

  console.log(`[SocketCtrl] ${socket.id} disconnected: ${reason}`);
};

module.exports = {
  handleTestMessage,
  handleSendLocation,
  handleDisconnect,
  handleGetHistory,
  handleGetAllLastLocations,
};
