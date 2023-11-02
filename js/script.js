const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const squareSize = 20

const snake = [{x: 200, y:200}, {x: 180, y:200}]

let direction, loopId

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
  ctx.strokeStyle = "red"

  ctx.lineTo(500, 0)
  ctx.lineTo(500, 500)
  ctx.stroke()
}

drawGrid()

const gameLoop = () => {
  clearInterval(loopId)
  ctx.clearRect(0, 0, 1000, 500)

  moveSnake()
  drawSnake()

  loopId = setInterval(() => {
    gameLoop()
  }, 100)
}

// gameLoop()

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