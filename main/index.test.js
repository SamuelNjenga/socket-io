const { createServer } = require("http");
const { Server } = require("socket.io");
const Client = require("socket.io-client");

describe("my awesome project", () => {
  let io, serverSocket, clientSocket;

  beforeAll((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = new Client(`http://localhost:${port}`);
      io.on("connection", (socket) => {
        serverSocket = socket;
      });
      clientSocket.on("connect", done);
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.close();
  });

  test("should work", (done) => {
    clientSocket.on("socket", (arg) => {
      expect(arg).toBe("io");
      done();
    });
    serverSocket.emit("socket", "io");
  });

  test("should work (with ack)", (done) => {
    serverSocket.on("socket", (cb) => {
      cb("io");
    });
    clientSocket.emit("socket", (arg) => {
      expect(arg).toBe("io");
      done();
    });
  });
  
});
