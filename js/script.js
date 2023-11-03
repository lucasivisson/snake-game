const canvas = document.querySelector('canvas')
const image = document.getElementById("source");
const ctx = canvas.getContext('2d')

const squareSize = 30

const snake = [{x: 210, y:210}, {x: 180, y:210}]

const randomNumber = (min, max) => {
  return Math.round(Math.random() * (max - min) + min)
}

const randomPosition = () => {
const number = randomPosition(0, canvas.width - squareSize)
}

const food = {
  x: randomPosition(),
  y: 90,
}

let direction, loopId

const drawFood = () => {
  const { x, y } = food
  ctx.shadowColor = "white"
  ctx.shadowBlur = 8
  ctx.drawImage(image, x, y, squareSize, squareSize)
  ctx.shadowBlur = 0
}

const drawSnake = () => {
  snake.forEach((position, index) => {
    if(index == 0) {
      ctx.fillStyle = "white";
    } else {
      ctx.fillStyle = "#ddd";
    }
    ctx.fillRect(position.x, position.y, squareSize, squareSize)
  })
}

const moveSnake = () => {
  if(!direction) return

  const snakeHeadPosition = snake[0]

  if(direction === "right") {
    snake.unshift({ x: snakeHeadPosition.x + squareSize, y: snakeHeadPosition.y })
  }

  if(direction === "left") {
    snake.unshift({ x: snakeHeadPosition.x - squareSize, y: snakeHeadPosition.y })
  }

  if(direction === "up") {
    snake.unshift({ x: snakeHeadPosition.x, y: snakeHeadPosition.y - squareSize})
  }

  if(direction === "down") {
    snake.unshift({ x: snakeHeadPosition.x, y: snakeHeadPosition.y + squareSize})
  }

  snake.pop()
}

const drawGrid = () => {
  ctx.lineWidth = 1
  ctx.strokeStyle = "#191919"

  for (let i=squareSize; i<canvas.width; i+=squareSize) {
      ctx.beginPath()
      ctx.lineTo(i, 0)
      ctx.lineTo(i, 510)
      ctx.stroke()

      ctx.beginPath()
      ctx.lineTo(0, i)
      ctx.lineTo(900, i)
      ctx.stroke()
  }
  
}

const gameLoop = () => {
  clearInterval(loopId)
  ctx.clearRect(0, 0, 900, 510)

  drawGrid()
  drawFood()
  moveSnake()
  drawSnake()

  loopId = setInterval(() => {
    gameLoop()
  }, 200)
}

gameLoop()

document.addEventListener("keydown", ({ key }) => {
  if(key == "ArrowRight" && direction !== "left") {
    direction = "right"
  } else if(key == "ArrowLeft" && direction !== "right") {
    direction = "left"
  } else if(key == "ArrowUp" && direction !== "down") {
    direction = "up"
  } else if(key == "ArrowDown" && direction !== "up") {
    direction = "down"
  }
})