const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const box = 20;
const canvasSize = canvas.width / box;
let snake = [{ x: 9 * box, y: 9 * box }];
let direction = "RIGHT";
let food = {
  x: Math.floor(Math.random() * canvasSize) * box,
  y: Math.floor(Math.random() * canvasSize) * box,
};
let score = 0;
let gameInterval;
let gameSpeed = 200;
let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
let playerName = "";

// Draw snake
function drawSnake() {
  snake.forEach((part, index) => {
    ctx.fillStyle = index === 0 ? "darkgreen" : "green";
    ctx.fillRect(part.x, part.y, box, box);
    ctx.strokeRect(part.x, part.y, box, box);
  });
}

// Draw food
function drawFood() {
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);
}

// Move snake
function moveSnake() {
  const head = { x: snake[0].x, y: snake[0].y };
  if (direction === "LEFT") head.x -= box;
  if (direction === "UP") head.y -= box;
  if (direction === "RIGHT") head.x += box;
  if (direction === "DOWN") head.y += box;
  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    food = {
      x: Math.floor(Math.random() * canvasSize) * box,
      y: Math.floor(Math.random() * canvasSize) * box,
    };
    // Increase speed
    if (gameSpeed > 50) {
      clearInterval(gameInterval);
      gameSpeed -= 10;
      gameInterval = setInterval(draw, gameSpeed);
    }
  } else {
    snake.pop();
  }
}

// Check collision
function checkCollision() {
  const head = snake[0];
  if (
    head.x < 0 ||
    head.x >= canvas.width ||
    head.y < 0 ||
    head.y >= canvas.height ||
    snake.slice(1).some((part) => part.x === head.x && part.y === head.y)
  ) {
    clearInterval(gameInterval);
    saveScore(playerName, score);
    alert(`Game Over! ${playerName}, your score is ${score}`);
    resetGame();
  }
}

// Save score to leaderboard
function saveScore(name, score) {
  leaderboard.push({ name, score });
  leaderboard.sort((a, b) => b.score - a.score);
  leaderboard = leaderboard.slice(0, 5);
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  updateLeaderboard();
}

// Update leaderboard
const scoresList = document.getElementById("scoresList");
function updateLeaderboard() {
  scoresList.innerHTML = "";
  showLeaderBoard(scoresList);
}


function showLeaderBoard(scoresList) {
  leaderboard.forEach((entry, index) => {
    const li = document.createElement("li");
    li.textContent = `${entry.name}: ${entry.score}`;
    scoresList.appendChild(li);
  });
}

showLeaderBoard(scoresList)

// Reset game
function resetGame() {
  snake = [{ x: 9 * box, y: 9 * box }];
  direction = "RIGHT";
  score = 0;
  gameSpeed = 200;
  document.getElementById("playerNameModal").style.display = "block";
  document.getElementById("playerName").value = "";
}

// Draw everything
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSnake();
  drawFood();
  moveSnake();
  checkCollision();
}

// Control snake
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

// Show player name modal on any key press
document.getElementById("startGame").addEventListener("click", () => {
  playerName = document.getElementById("playerName").value;
  if (playerName) {
    document.getElementById("playerNameModal").style.display = "none";
    updateLeaderboard();
    gameInterval = setInterval(draw, gameSpeed);
  } else {
    alert("Please enter your name.");
  }
});
