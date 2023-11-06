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

  public gameLoop() {}
}
