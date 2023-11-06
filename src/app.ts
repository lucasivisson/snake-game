import express, { Request, Response } from "express";
import http from "node:http";
import { Server, Socket } from "socket.io";
import path from "node:path";
import { Game } from "./entities/Game";
import { Snake } from "./entities/Snake";

var publicPath = path.join(__dirname, "public");
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get("/", function (req, res) {
  res.sendFile(path.join(publicPath, "index.html"));
});

const game = new Game(1000, 510, 30);
let snake: Snake;

io.on("connection", (socket) => {
  socket.on("create-snake", () => {
    snake = new Snake(game);
    snake.generateSnakeBody();
    game.addSnake(snake);
    io.emit("create-snake", {
      snake: { id: snake.id, body: snake.body },
      food: game.food,
      usersConnected: game.snakes.length,
    });
  });

  socket.on("move-snake", (data) => {
    console.log("entrou aq?", snake);
    snake.setDirection(data);
    snake.moveSnake();
    snake.checkEat();

    io.emit("move-snake", {
      snake: { id: snake.id, body: snake.body },
      food: game.food,
    });
  });
});

app.use(express.static(publicPath));
server.listen(3000);
