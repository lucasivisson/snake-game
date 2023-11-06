const canvas = document.querySelector('canvas')
const image = document.getElementById('source');
const ctx = canvas.getContext('2d')
const audio = new Audio('../assets/assets_audio.mp3')

const form = document.getElementById('form');
const input = document.getElementById('input');

let snakes = [{id: 0, body: {x: 30, y:30}, points: 0}];
let food = {
  x: 0,
  y: 0,
}
let id;
let usersConnected = 0;
let tryingToStartGame = false
const squareSize = 30;
const socket = io();
let direction = "right";
let loopId;
let directionChanged = true;

form.addEventListener('submit', (e) => {
  tryingToStartGame = true
  e.preventDefault();
  socket.emit('create-snake');
});

socket.on("connect", () => {
  id = socket.id

  socket.on('disconnect', () => {
    usersConnected--;
    const index = snakes.findIndex(snake => snake.id === id);
    if(index > -1) {
      snakes.splide(index, 1)
    }
    id = undefined
  })
})

socket.on('create-snake', (data) => {
  snakes = data.snakes;
  food = data.food;
  usersConnected = data.usersConnected
  if(usersConnected === 1 && id == data.id) {
    const newGameDiv = document.getElementsByClassName('new-game')[0];
    newGameDiv.style.display = "none";
    const waitingPlayer = document.getElementsByClassName('waiting-player')[0];
    waitingPlayer.style.display = "block";
  } else if(usersConnected === 2){
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
  snakes.forEach((snake, _index) => {
    snake.body.forEach((body, index) => {
      if(index == 0) {
        ctx.fillStyle = "white";
      } else {
        ctx.fillStyle = "#ddd";
      }
      if(id != snake.id) {
        ctx.globalAlpha = 0.3
      }
      ctx.fillRect(body.x, body.y, squareSize, squareSize)
    })
    ctx.globalAlpha = 1
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
  if(usersConnected == 2 && tryingToStartGame) {
    const snake = snakes.find(snake => snake.id == id)
    socket.emit("move-snake", {direction: direction, id: snake.id})
    socket.on('move-snake', (data) => {
      snakes = data.snakes;
      food = data.food;
      if(data.wasFruitEaten) {
        audio.play();
      }
      const myOwnSnake = snakes.find(snake => snake.id == id)
      const oponentSnake = snakes.find(snake => snake.id != id)
      const startScreen = document.getElementsByClassName('start-screen')[0];
      const newGameDiv = document.getElementsByClassName('new-game')[0];
      const waitingPlayer = document.getElementsByClassName('waiting-player')[0];
      if(myOwnSnake.win) {
        const winnerDiv = document.getElementsByClassName('winner')[0];
        startScreen.style.display = "block"
        winnerDiv.style.display = "block"
        newGameDiv.style.display = "none"
        waitingPlayer.style.display = "none"
      } else if(oponentSnake.win){
        const loserDiv = document.getElementsByClassName('loser')[0];
        startScreen.style.display = "block"
        loserDiv.style.display = "block"
        newGameDiv.style.display = "none"
        waitingPlayer.style.display = "none"
      }
    })
    directionChanged = true
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
  }, 200)
}

gameLoop()

document.addEventListener("keydown", ({ key }) => {
  // console.log('dfasdas', directionHasChanged)
  // if(directionHasChanged) {
    if(key == "ArrowRight" && direction !== "left") {
      direction = "right"
    } else if(key == "ArrowLeft" && direction !== "right") {
      direction = "left"
    } else if(key == "ArrowUp" && direction !== "down") {
      direction = "up"
    } else if(key == "ArrowDown" && direction !== "up") {
      direction = "down"
    }
    // directionChanged = false
  // }
})