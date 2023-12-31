import { randomPosition } from "../utils/generateNumber";
import { Game } from "./Game";

export class Snake {
  public body: [{ x: number; y: number }];
  public direction: string;
  public points;
  public win;

  constructor(public game: Game, public id: string) {
    this.body = [{ x: 0, y: 0 }];
    this.id = id;
    this.points = 0;
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
      this.points = this.points + 1;
      if (this.points === 10) {
        this.win = true;
      }

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
