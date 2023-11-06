function randomNumber(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min);
}

export function randomPosition(min: number, max: number, squareSize: number) {
  const number = randomNumber(min, max);
  return Math.round(number / squareSize) * squareSize;
}
