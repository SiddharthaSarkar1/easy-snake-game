const gameBoardContainer = document.querySelector(".game-board-container");

const DPI = window.devicePixelRatio;

const canvas = document.createElement("canvas");

const ctx = canvas.getContext("2d");

function createCanvas(width, height) {
  canvas.style.width = `${width}px`;

  canvas.style.height = `${height}px`;

  canvas.width = Math.floor(width * DPI);

  canvas.height = Math.floor(height * DPI);

  ctx.scale(DPI, DPI);

  gameBoardContainer.appendChild(canvas);
}

function background(color = "black") {
  canvas.style.background = color;
}

const Direction = {
  RIGHT: 1,

  LEFT: 2,

  UP: 3,

  DOWN: 4,
};

class SnakeGameAI {
  constructor(w = 360, h = 400) {
    this.w = w;

    this.h = h;

    this.blockSize = 10;

    this.reset();
  }

  reset() {
    this.pos = { x: 5, y: 8 };

    this.foodPos = {
      x: Math.floor(Math.random() * 36),

      y: Math.floor(Math.random() * 40),
    };

    this.snakeArr = [];

    this.snakeArr.push(this.pos);

    this.snakeArr.push(this.pos);

    this.snakeArr.push(this.pos);

    this.score = 0;
  }

  playStep(key) {
    // Eat food condition

    if (this.pos.x === this.foodPos.x && this.pos.y === this.foodPos.y) {
      this.#placeFood();

      this.snakeArr.push(this.pos);

      this.score++;
    }

    // Moving snake

    for (let i = this.snakeArr.length - 1; i > 0; i--) {
      this.snakeArr[i] = { ...this.snakeArr[i - 1] };

      //   console.log(this.snakeArr[i]);
    }

    // Control snake

    this.#move(key);

    let gameOver = false;

    // Game Over

    if (this.#gameover()) {
      this.#placeFood();
      this.reset();
      gameOver = true;
    }

    return {
      gameOver: gameOver,
      score: this.score,
    };
  }

  //Function to draw the grid
  #drawGrid(ctx, gridSize, canvasWidth, canvasHeight) {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)"; // Adjust the color and transparency
    ctx.lineWidth = 1;

    // Draw horizontal lines
    for (let y = 0; y <= canvasHeight; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasWidth, y);
      ctx.stroke();
    }

    // Draw vertical lines
    for (let x = 0; x <= canvasWidth; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasHeight);
      ctx.stroke();
    }
  }

  draw(ctx) {
    this.#drawGrid(ctx, 10, canvas.width, canvas.height);
    for (let i = 0; i < this.snakeArr.length; i++) {
      if (i == 0) ctx.fillStyle = "red";
      else ctx.fillStyle = "#098567";

      ctx.fillRect(
        this.snakeArr[i].x * this.blockSize,
        this.snakeArr[i].y * this.blockSize,
        this.blockSize,
        this.blockSize
      );
      ctx.fill();
    }

    ctx.fillStyle = "blue";

    ctx.fillRect(
      this.foodPos.x * this.blockSize,
      this.foodPos.y * this.blockSize,
      this.blockSize,
      this.blockSize
    );

    ctx.fill();
  }

  #placeFood() {
    this.foodPos = {
      x: Math.floor(Math.random() * 36),

      y: Math.floor(Math.random() * 40),
    };
  }

  #move(key) {
    if (key === Direction.LEFT) {
      this.pos.x -= 1;
    } else if (key === Direction.UP) {
      this.pos.y -= 1;
    } else if (key === Direction.RIGHT) {
      this.pos.x += 1;
    } else {
      this.pos.y += 1;
    }
  }

  #gameover() {
    let headPos = { ...this.snakeArr[0] };

    if (headPos.x < 0 || headPos.x > 36 || headPos.y < 0 || headPos.y > 40) {
      return true;
    }

    for (let i = 1; i < this.snakeArr.length; i++) {
      let bodyPos = { ...this.snakeArr[i] };

      if (headPos.x === bodyPos.x && headPos.y === bodyPos.y) {
        return true;
      }
    }

    return false;
  }

  getScore() {
    return this.score;
  }
}

createCanvas(360, 400);

background("#D5D5D5");

// Buttons

const buttons = document.querySelectorAll(".btn");

const btnLeft = buttons[0];

const btnUp = buttons[1];

const btnRight = buttons[2];

const btnDown = buttons[3];

const scoreDom = document.querySelector("#score");

const gameOverDom = document.querySelector("#game-over");

const snake = new SnakeGameAI();

let CONTROL = 1;

btnLeft.addEventListener("click", () => {
  CONTROL = 2;
});

btnUp.addEventListener("click", () => {
  CONTROL = 3;
});

btnRight.addEventListener("click", () => {
  CONTROL = 1;
});

btnDown.addEventListener("click", () => {
  CONTROL = 4;
});

// Function to handle arrow key presses
function handleArrowKeyPress(event) {
  switch (event.key) {
    case "ArrowLeft":
      CONTROL = 2;
      break;
    case "ArrowUp":
      CONTROL = 3;
      break;
    case "ArrowRight":
      CONTROL = 1;
      break;
    case "ArrowDown":
      CONTROL = 4;
      break;
    default:
      break;
  }
}

document.addEventListener("keydown", handleArrowKeyPress);

let x = 0;

let now;

let then = Date.now();

let fps = 10;

let interval = 1000 / fps;

let delta;

function animate() {
  now = Date.now();

  delta = now - then;

  if (delta > interval) {
    then = now - (delta % interval);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let infoObj = snake.playStep(CONTROL);
    snake.draw(ctx);
    scoreDom.innerHTML = `Score: ${infoObj.score}`;
    if (infoObj.gameOver) {
      overlay.style.display = "block";
      gameOverDom.style.visibility = "visible";
    } else {
      overlay.style.display = "none";
      gameOverDom.style.visibility = "hidden";
    }
  }

  requestAnimationFrame(animate);
}

animate();
