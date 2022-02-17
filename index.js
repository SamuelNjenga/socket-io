const express = require("express");
const { Server } = require("socket.io");
const app = express();
const http = require("http");
const server = http.createServer(app);

const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/main/index.html");
});

io.on("connection", (socket) => {
  console.log("a user connected");

  // Each socket also fires a special disconnect event
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
  });

  // send the message to everyone, including the sender
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });

  // handle the event sent with socket.emit()
  socket.on("salutations", (elem1, elem2, elem3) => {
    console.log("Salutations", elem1, elem2, elem3);
  });

  // handle the event sent with socket.send()
  socket.on("message", (data) => {
    console.log(data);
  });
  //fetch the number of currently connected clients
  const count = io.engine.clientsCount;
  // may or may not be similar to the count of Socket instances in the main namespace, depending on your usage
  const count2 = io.of("/").sockets.size;
  console.log("Connected devices are : ", count2, count);

  // #socketid
  console.log("SID", socket.id);
  returnSockets();
  // make all Socket instances join the "room1" room
  io.socketsJoin("room1");
  roomSockets();
});

// return all Socket instances of the main namespace
const returnSockets = async () => {
  const sockets = await io.fetchSockets();
  for (const socket of sockets) {
    console.log("SOCKET ID", socket.id);
    console.log("SOCKET HANDSHAKE", socket.handshake);
    console.log("SOCKET ROOMS", socket.rooms);
    console.log("SOCKET DATA", socket.data);
  }
};

// return all Socket instances in the "room1" room of the main namespace
const roomSockets = async () => {
  const sockets = await io.in("room1").fetchSockets();
  for (const socket of sockets) {
    console.log("SOCKET ID", socket.id);
  }
};

server.listen(5000, () => {
  console.log("listening on *:5000");
});
