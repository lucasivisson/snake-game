import { Food } from "./Food";
import { Snake } from "./Snake";

export class Game {
  public snakes: Snake[];
  public food: Food;

  constructor(
    public width: number,
    public height: number,
    public squareSize: number
  ) {
    this.snakes = [];
    this.food = new Food();
    this.food.generateFood(this.width, this.height, this.squareSize);
  }

  public addSnake(snake: Snake) {
    this.snakes.push(snake);
  }

  public removeSnake(id: string) {
    let index = this.snakes.findIndex((snake) => snake.id === id);
    if (index > -1) {
      this.snakes.splice(index, 1);
    }
  }

  public updateSnakePoints() {
    this.snakes.forEach((snake) => {
      snake.points = 0;
    });
  }

  public resetSnakes() {
    this.snakes.forEach((snake) => {
      snake.body = [{ x: snake.body[0].x, y: snake.body[0].y }];
      snake.points = 0;
      snake.win = false;
    });
  }

  public findSnake(id: string) {
    return this.snakes.find((snake) => snake.id === id);
  }
}
