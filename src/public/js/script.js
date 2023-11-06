const canvas = document.querySelector('canvas')
const image = document.getElementById('source');
const ctx = canvas.getContext('2d')
const audio = new Audio('../assets/assets_audio.mp3')

const form = document.getElementById('form');
const input = document.getElementById('input');

let snakes = [{id: 0, body: {x: 30, y:30}}]
let food = {
  x: 0,
  y: 0,
}
let id;
let usersConnected = 0
const squareSize = 30
const socket = io();
let direction = "right"
let loopId

form.addEventListener('submit', (e) => {
  e.preventDefault();
  socket.emit('create-snake');
});

socket.on('create-snake', (data) => {
  console.log('create-snake', data)
  snakes = data.snakes;
  food = data.food
  id = data.id,
  usersConnected = data.usersConnected
  console.log('snakesssss', snakes)
  if(usersConnected === 1 && id) {
    const newGameDiv = document.getElementsByClassName('new-game')[0];
    newGameDiv.style.display = "none";
    const waitingPlayer = document.getElementsByClassName('waiting-player')[0];
    waitingPlayer.style.display = "block";
  } else if(usersConnected === 2 && id){
    const startScreen = document.getElementsByClassName('start-screen')[0];
    startScreen.style.display = "none"
  }
})


const randomNumber = (min, max) => {
  return Math.round(Math.random() * (max - min) + min)
}

const randomPosition = (min, max) => {
  const number = randomNumber(min, max)
  return Math.round(number / squareSize) * squareSize
}

const drawFood = () => {
  const { x, y } = food
  ctx.shadowColor = "red"
  ctx.shadowBlur = 6
  ctx.drawImage(image, x, y, squareSize, squareSize)
  ctx.shadowBlur = 0
}

const drawSnake = () => {
  console.log('osh vei', snakes)
  snakes.forEach((snake, _index) => {
    snake.body.forEach((body, index) => {
      if(index == 0) {
        ctx.fillStyle = "white";
      } else {
        ctx.fillStyle = "#ddd";
      }
      ctx.fillRect(body.x, body.y, squareSize, squareSize)
    })
  })
}

const moveSnake = () => {
  if(!direction) return

  const snakeHeadPosition = snake[0]

  if(direction === "right") {
    snake.unshift({ x: snakeHeadPosition.body.x + squareSize, y: snakeHeadPosition.body.y })
  }

  if(direction === "left") {
    snake.unshift({ x: snakeHeadPosition.body.x - squareSize, y: snakeHeadPosition.body.y })
  }

  if(direction === "up") {
    snake.unshift({ x: snakeHeadPosition.body.x, y: snakeHeadPosition.body.y - squareSize})
  }

  if(direction === "down") {
    snake.unshift({ x: snakeHeadPosition.body.x, y: snakeHeadPosition.body.y + squareSize})
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

const checkEat = () => {
  const snakeHeadPosition = snake[0];
  
  if(snakeHeadPosition.body.x == food.x && snakeHeadPosition.body.y == food.y) {
    snake.body.push(snake.body[snake.body.length-1])
    audio.play();

    let x = randomPosition(0, canvas.width - squareSize)
    let y = randomPosition(0, canvas.height - squareSize)
    while(snake.find((position) => position.x == x && position.y == y)) {
      x = randomPosition(0, canvas.width - squareSize)
      y = randomPosition(0, canvas.height - squareSize)
    }
    food.x = x
    food.y = y
  }
}

const checkCollision = () => {
  for(let snakeObject of snake) {
    if(snakeObject.body.x < 0) {
      snakeObject.body.x = canvas.width - squareSize
    } else if(snakeObject.body.x > canvas.width - squareSize) {
      snakeObject.body.x = 0
    } else if(snakeObject.body.y < 0) {
      snakeObject.body.y = canvas.height - squareSize
    } else if(snakeObject.body.y > canvas.height - squareSize) {
      snakeObject.body.y = 0
    }
  }
}

const gameLoop = () => {
  clearInterval(loopId)
  if(usersConnected == 2) {
    const snake = snakes.find(snake => snake.id == id)
    socket.emit("move-snake", {direction: direction, id: snake.id})
    socket.on('move-snake', (data) => {
      console.log('move-snake', data)
      snakes = data.snakes;
      food = data.food;
      if(data.wasFruitEaten) {
        audio.play();
      }
    })
    ctx.clearRect(0, 0, 900, 510)
    
    drawGrid()
    drawFood()
    drawSnake()
    // moveSnake()
    // checkCollision()
    // checkEat()
  }

  loopId = setInterval(() => {
    gameLoop()
  }, 5000)
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