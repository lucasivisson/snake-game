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

const game = new Game(900, 510, 30);
let snake: Snake;

io.on("connection", (socket) => {
  socket.on("create-snake", () => {
    snake = new Snake(game);
    snake.generateSnakeBody();
    game.addSnake(snake);
    let snakes = [];
    game.snakes.forEach((snake) => {
      snakes.push({ id: snake.id, body: snake.body });
    });
    io.emit("create-snake", {
      snakes,
      food: game.food,
      id: snake.id,
      usersConnected: game.snakes.length,
    });
  });

  socket.on("move-snake", (data) => {
    const snake = game.findSnake(data.id);
    snake.setDirection(data.direction);
    snake.moveSnake();
    snake.checkCollision();
    let wasFruitEaten = snake.checkEat();
    let snakes = [];
    game.snakes.forEach((snake) => {
      snakes.push({ id: snake.id, body: snake.body });
    });
    io.emit("move-snake", {
      snakes,
      wasFruitEaten: false,
      food: game.food,
    });
  });
});

app.use(express.static(publicPath));
server.listen(3000);
