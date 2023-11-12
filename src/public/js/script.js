const canvas = document.querySelector('canvas')
const image = document.getElementById('source');
const ctx = canvas.getContext('2d')
const audio = new Audio('../assets/assets_audio.mp3')

const startGameForm = document.getElementById('start-game-form');
const backMenuForm = document.getElementById('back-menu-form');
const input = document.getElementById('input');
const startScreen = document.getElementsByClassName('start-screen')[0];
const newGameDiv = document.getElementsByClassName('new-game')[0];
const waitingPlayer = document.getElementsByClassName('waiting-player')[0];
const winnerDiv = document.getElementsByClassName('winner')[0];
const loserDiv = document.getElementsByClassName('loser')[0];
const playerDisconnected = document.getElementsByClassName('player-disconnected')[0];
const scoresDiv = document.getElementsByClassName('scores')[0]
const myScoreSpan = document.getElementsByClassName('my-score')[0]
const oponentScoreSpan = document.getElementsByClassName('oponent-score')[0]
const severFull = document.getElementsByClassName('server-full')[0]

let snakes = [{id: 0, body: {x: 30, y:30}, points: 0}];
let food = {
  x: 0,
  y: 0,
}
let id;
let usersConnected = 0;
let tryingToStartGame = false;
const squareSize = 30;
const socket = io();
let direction = "right";
let loopId;
let theGameIsOver = true;

startGameForm.addEventListener('submit', (e) => {
  tryingToStartGame = true
  e.preventDefault();
  socket.emit('create-snake');
});

backMenuForm.addEventListener('submit', (e) => {
  tryingToStartGame = false
  e.preventDefault();
  socket.emit('skip-game');
  startScreen.style.display = "flex"
  severFull.style.display = "none"
  newGameDiv.style.display = "block"
  waitingPlayer.style.display = "none"
  playerDisconnected.style.display = "none"
  scoresDiv.style.display = "none"
});

socket.on("skip-game", (data) => {
  usersConnected = data.usersConnected;
  snakes = data.snakes;
  theGameIsOver = true;
})

socket.on("connect", () => {
  id = socket.id
})

socket.on("connection-full", (data) => {
  if(id == data.id) {
    startScreen.style.display = "flex"
    severFull.style.display = "block"
    newGameDiv.style.display = "none"
    waitingPlayer.style.display = "none"
    playerDisconnected.style.display = "none"
    scoresDiv.style.display = "none"
  }
})

socket.on("update-connection", (data) => {
  snakes = data.snakes;
  if(data.usersConnected < 2 && !theGameIsOver) {
    startScreen.style.display = "block"
    playerDisconnected.style.display = "block"
    newGameDiv.style.display = "none"
    severFull.style.display = "none"
    waitingPlayer.style.display = "none"
    scoresDiv.style.display = "none"
    theGameIsOver = true
  }
})

socket.on('create-snake', (data) => {
  const snake = data.snakes.find((snake) => snake.id == id);
  if(snake) {
    snakes = data.snakes;
    food = data.food;
    usersConnected = data.usersConnected
    if(usersConnected === 1 && id == data.id) {
      newGameDiv.style.display = "none";
      waitingPlayer.style.display = "block";
    } else if(usersConnected === 2){
      startScreen.style.display = "none"
      scoresDiv.style.display = "flex"
      theGameIsOver = false
      gameLoop()
    }
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
    if(snake.id == id) {
      snake.body.forEach((body, index) => {
        if(index == 0) {
          ctx.fillStyle = "#3b81fe"; 
        } else {
          ctx.fillStyle = "#3b53fe";
        }
        if(id != snake.id) {
          ctx.globalAlpha = 0.3
        }
        ctx.fillRect(body.x, body.y, squareSize, squareSize)
      })
    } else {
      snake.body.forEach((body, index) => {
        if(index == 0) {
          ctx.fillStyle = "#ff002d";
        } else {
          ctx.fillStyle = "#bb002d";
        }
        if(id != snake.id) {
          ctx.globalAlpha = 0.3
        }
        ctx.fillRect(body.x, body.y, squareSize, squareSize)
      })
    }
    ctx.globalAlpha = 1
  })
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
      myScoreSpan.innerHTML = `Meus pontos: ${myOwnSnake.points}`
      const oponentSnake = snakes.find(snake => snake.id != id)
      oponentScoreSpan.innerHTML = `Pontos do oponente: ${oponentSnake.points}`
      if(myOwnSnake.win) {
        startScreen.style.display = "block"
        winnerDiv.style.display = "block"
        newGameDiv.style.display = "none"
        waitingPlayer.style.display = "none"
        scoresDiv.style.display = "none"
        playerDisconnected.style.display = "none"
        usersConnected = 0
        snakes = []
        socket.disconnect()
        theGameIsOver = true
      } else if(oponentSnake.win) {
        startScreen.style.display = "block"
        loserDiv.style.display = "block"
        newGameDiv.style.display = "none"
        waitingPlayer.style.display = "none"
        scoresDiv.style.display = "none"
        playerDisconnected.style.display = "none"
        usersConnected = 0
        snakes = []
        socket.disconnect()
        theGameIsOver = true
      }
    })
    ctx.clearRect(0, 0, 900, 510)
    
    drawGrid()
    drawFood()
    drawSnake()
    if(theGameIsOver) {
      clearInterval(loopId)
      return
    }
  }

  loopId = setInterval(() => {
    gameLoop()
  }, 300)
}

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