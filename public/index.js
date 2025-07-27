class SnakeGame {
  constructor({ boardId, scoreId, resetId, size = 25 }) {
    this.canvas = document.querySelector(boardId);
    this.ctx = this.canvas.getContext("2d");
    this.scoreEl = document.querySelector(scoreId);
    this.resetBtn = document.querySelector(resetId);

    this.unit = size;
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    this.colors = {
      bg: "white",
      snake: "lightgreen",
      border: "black",
      food: "red",
    };

    this.init();
  }

  init() {
    this.resetBtn.onclick = () => this.start();
    window.onkeydown = (e) => this.setDirection(e.keyCode);
    this.start();
  }

  start() {
    this.running = true;
    this.score = 0;
    this.snake = Array.from({ length: 5 }, (_, i) => ({
      x: i * this.unit,
      y: 0,
    })).reverse();
    [this.xv, this.yv] = [this.unit, 0];
    this.spawnFood();
    this.loop();
  }

  loop() {
    if (!this.running) return this.gameOver();
    setTimeout(() => {
      this.update();
      this.draw();
      this.loop();
    }, 75);
  }

  update() {
    const head = { x: this.snake[0].x + this.xv, y: this.snake[0].y + this.yv };
    this.snake.unshift(head);

    if (head.x === this.food.x && head.y === this.food.y) {
      this.scoreEl.textContent = ++this.score;
      this.spawnFood();
    } else this.snake.pop();

    if (
      head.x < 0 ||
      head.x >= this.width ||
      head.y < 0 ||
      head.y >= this.height ||
      this.snake.slice(1).some((p) => p.x === head.x && p.y === head.y)
    )
      this.running = false;
  }

  draw() {
    const { bg, food, snake, border } = this.colors;
    this.ctx.fillStyle = bg;
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.ctx.fillStyle = food;
    this.ctx.fillRect(this.food.x, this.food.y, this.unit, this.unit);

    this.ctx.fillStyle = snake;
    this.ctx.strokeStyle = border;
    this.snake.forEach((p) => {
      this.ctx.fillRect(p.x, p.y, this.unit, this.unit);
      this.ctx.strokeRect(p.x, p.y, this.unit, this.unit);
    });
  }

  spawnFood() {
    const rand = (max) =>
      Math.floor(Math.random() * (max / this.unit)) * this.unit;
    this.food = { x: rand(this.width), y: rand(this.height) };
  }

  setDirection(code) {
    const [x, y] = [this.xv, this.yv];
    switch (code) {
      case 37:
        if (x === 0) [this.xv, this.yv] = [-this.unit, 0];
        break;
      case 38:
        if (y === 0) [this.xv, this.yv] = [0, -this.unit];
        break;
      case 39:
        if (x === 0) [this.xv, this.yv] = [this.unit, 0];
        break;
      case 40:
        if (y === 0) [this.xv, this.yv] = [0, this.unit];
        break;
    }
  }

  gameOver() {
    this.ctx.font = "40px sans-serif";
    this.ctx.fillStyle = "black";
    this.ctx.textAlign = "center";
    this.ctx.fillText("Game Over", this.width / 2, this.height / 2);
  }
}

// Start
document.addEventListener("DOMContentLoaded", () => {
  new SnakeGame({
    boardId: "#gameBoard",
    scoreId: "#scoreText",
    resetId: "#resetBtn",
  });
});
