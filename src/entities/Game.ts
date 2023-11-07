import { Food } from "./Food";
import { Snake } from "./Snake";

export class Game {
  public snakes: Snake[];
  public food: Food;
  public connections: number;

  constructor(
    public width: number,
    public height: number,
    public squareSize: number
  ) {
    this.snakes = [];
    this.food = new Food();
    this.food.generateFood(this.width, this.height, this.squareSize);
    this.connections = 0;
  }

  public setConnections(increase: boolean) {
    if (increase) {
      this.connections = this.connections + 1;
    } else {
      this.connections = this.connections - 1;
    }
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

  public findSnake(id: string) {
    return this.snakes.find((snake) => snake.id === id);
  }

  public gameLoop() {}
}
