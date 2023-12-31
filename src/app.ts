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
  console.log("user connected");

  socket.on("ping", () => {
    socket.emit("pong");
  });

  socket.on("disconnect", (reason) => {
    console.log(`user disconnected due to ${reason}`);
    game.removeSnake(socket.id);
    game.resetSnakes();
    let snakes = [];
    game.snakes.forEach((snake) => {
      snakes.push({
        id: snake.id,
        body: snake.body,
        points: snake.points,
        win: snake.win,
      });
    });
    if (game.snakes.length > 0) {
      io.emit("update-connection", {
        usersConnected: game.snakes.length,
        snakes,
      });
    }
  });

  socket.on("error", (error) => {
    console.error(`error occurred: ${error.message}`);
  });

  socket.on("create-snake", () => {
    if (game.snakes.length === 2) {
      io.emit("connection-full", { id: socket.id });
      console.log(
        "a new user tried to connect to the game, but the server is full"
      );
    } else {
      snake = new Snake(game, socket.id);
      snake.generateSnakeBody();
      game.addSnake(snake);
      let snakes = [];
      game.snakes.forEach((snake) => {
        snakes.push({
          id: snake.id,
          body: snake.body,
          points: snake.points,
          win: snake.win,
        });
      });
      io.emit("create-snake", {
        snakes,
        food: game.food,
        id: snake.id,
        usersConnected: game.snakes.length,
      });
      console.log(`snake created successfully with id: ${socket.id}`);
    }
  });

  socket.on("skip-game", () => {
    console.log(`user of id: ${socket.id} returned to home screen`);
    game.removeSnake(socket.id);
    let snakes = [];
    game.snakes.forEach((snake) => {
      snakes.push({
        id: snake.id,
        body: snake.body,
        points: snake.points,
        win: false,
      });
    });
    io.emit("skip-game", {
      usersConnected: game.snakes.length,
      snakes,
    });
  });

  socket.on("move-snake", (data) => {
    const snake = game.findSnake(data.id);
    if (snake) {
      snake.setDirection(data.direction);
      snake.moveSnake();
      snake.checkCollision();
      let wasFruitEaten = snake.checkEat();
      let snakes = [];
      let someoneWin = false;
      game.snakes.forEach((snake) => {
        if (snake.win) {
          someoneWin = true;
        }
        snakes.push({
          id: snake.id,
          body: snake.body,
          points: snake.points,
          win: snake.win,
        });
      });
      io.emit("move-snake", {
        snakes,
        someoneWin,
        wasFruitEaten,
        food: game.food,
      });
      console.log(
        `snake user ${socket.id} has moved to the ${snake.direction} and is with snake head in the position x: ${snake.body[0].x} e y: ${snake.body[0].y}`
      );
    }
  });
});

app.use(express.static(publicPath));
server.listen(3000);
