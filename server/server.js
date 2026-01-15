const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const initializeSocket = require("./src/sockets");

const app = express();
app.use(cors());

const server = http.createServer(app);
const port = 3000;
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

initializeSocket(io); // Socket.IO 핸들러 초기화

app.get("/", (req, res) => {
  res.send("Hello World!");
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
