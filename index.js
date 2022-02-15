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
});

server.listen(5000, () => {
  console.log("listening on *:5000");
});
