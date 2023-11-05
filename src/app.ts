import express, { Request, Response } from "express";
import http from "node:http";
import { Server } from "socket.io";
import path from "node:path";

var publicPath = path.join(__dirname, "public");
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get("/", function (req, res) {
  res.sendFile(path.join(publicPath, "index.html"));
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

app.use(express.static(publicPath));
server.listen(3000);
