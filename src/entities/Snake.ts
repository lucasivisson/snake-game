import { randomPosition } from "../utils/generateNumber";
import { Game } from "./Game";
import crypto from "node:crypto";

export class Snake {
  public body: [{ x: number; y: number }];
  public direction: string;

  constructor(public game: Game, public id: string) {
    this.body = [{ x: 0, y: 0 }];
    this.id = id;
  }

  public generateSnakeBody() {
    let x = randomPosition(
      0,
      this.game.width - this.game.squareSize,
      this.game.squareSize
    );
    let y = randomPosition(
      0,
      this.game.height - this.game.squareSize,
      this.game.squareSize
    );
    while (this.game.food.x == x && this.game.food.y == y) {
      x = randomPosition(
        0,
        this.game.width - this.game.squareSize,
        this.game.squareSize
      );
      y = randomPosition(
        0,
        this.game.height - this.game.squareSize,
        this.game.squareSize
      );
    }
    if (this.body.length === 1) {
      this.body = [{ x: x, y: y }];
    } else {
      this.body.push({ x: x, y: y });
    }
  }

  public setDirection(direction: string) {
    this.direction = direction;
  }

  // public changeDirection(pressedKey: string): void {
  //   if (pressedKey == "ArrowRight" && this.direction !== "left") {
  //     this.direction = "right";
  //   } else if (pressedKey == "ArrowLeft" && this.direction !== "right") {
  //     this.direction = "left";
  //   } else if (pressedKey == "ArrowUp" && this.direction !== "down") {
  //     this.direction = "up";
  //   } else if (pressedKey == "ArrowDown" && this.direction !== "up") {
  //     this.direction = "down";
  //   }
  // }

  public moveSnake() {
    if (!this.direction) return;

    const snakeHeadPosition = this.body[0];

    if (this.direction === "right") {
      this.body.unshift({
        x: snakeHeadPosition.x + this.game.squareSize,
        y: snakeHeadPosition.y,
      });
    }

    if (this.direction === "left") {
      this.body.unshift({
        x: snakeHeadPosition.x - this.game.squareSize,
        y: snakeHeadPosition.y,
      });
    }

    if (this.direction === "up") {
      this.body.unshift({
        x: snakeHeadPosition.x,
        y: snakeHeadPosition.y - this.game.squareSize,
      });
    }

    if (this.direction === "down") {
      this.body.unshift({
        x: snakeHeadPosition.x,
        y: snakeHeadPosition.y + this.game.squareSize,
      });
    }

    this.body.pop();
  }

  public checkEat(): boolean {
    const snakeHeadPosition = this.body[0];

    if (
      snakeHeadPosition.x == this.game.food.x &&
      snakeHeadPosition.y == this.game.food.y
    ) {
      this.body.push(this.body[this.body.length - 1]);
      // audio.play();

      this.game.food.generateNewPosition(
        this.game.width,
        this.game.height,
        this.body,
        this.game.squareSize
      );

      return true;
    }
    return false;
  }

  public checkCollision(): void {
    for (let position of this.body) {
      if (position.x < 0) {
        position.x = this.game.width - this.game.squareSize;
      } else if (position.x > this.game.width - this.game.squareSize) {
        position.x = 0;
      } else if (position.y < 0) {
        position.y = this.game.height - this.game.squareSize;
      } else if (position.y > this.game.height - this.game.squareSize) {
        position.y = 0;
      }
    }
  }
}
