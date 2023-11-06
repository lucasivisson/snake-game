import { randomPosition } from "../utils/generateNumber";

export class Food {
  public x: number;
  public y: number;

  constructor() {}

  public generateFood(width: number, height: number, squareSize: number) {
    this.x = randomPosition(0, width - squareSize, squareSize);
    this.y = randomPosition(0, height - squareSize, squareSize);
  }

  public generateNewPosition(
    width: number,
    height: number,
    bodySnake: [{ x: number; y: number }],
    squareSize: number
  ) {
    let x = randomPosition(0, width - squareSize, squareSize);
    let y = randomPosition(0, height - squareSize, squareSize);
    while (bodySnake.find((position) => position.x == x && position.y == y)) {
      x = randomPosition(0, width - squareSize, squareSize);
      y = randomPosition(0, height - squareSize, squareSize);
    }
    this.x = x;
    this.y = y;
  }
}
