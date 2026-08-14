const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('highScore');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{x: 10, y: 10}];
let food = {x: 5, y: 5};
let dx = 1;
let dy = 0;
let score = 0;
let highScore = localStorage.getItem('snake_highscore') || 0;
highScoreEl.textContent = highScore;

let gameInterval;
let gameSpeed = 100;
let changingDirection = false;

function startGame() {
    snake = [{x: 10, y: 10}];
    generateFood();
    dx = 1;
    dy = 0;
    score = 0;
    scoreEl.textContent = score;
    clearInterval(gameInterval);
    gameInterval = setInterval(main, gameSpeed);
}

function main() {
    if (hasGameEnded()) {
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('snake_highscore', highScore);
            highScoreEl.textContent = highScore;
        }
        alert("GAME OVER! Press Enter or Click OK to matrix reset.");
        startGame();
        return;
    }

    changingDirection = false;
    clearCanvas();
    drawFood();
    moveSnake();
    drawSnake();
}

function clearCanvas() {
    ctx.fillStyle = '#05070f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = '#101424';
    ctx.lineWidth = 0.5;
    for(let i = 0; i <= tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }
}

function drawSnake() {
    snake.forEach((part, index) => {
        ctx.fillStyle = index === 0 ? '#00ffcc' : '#00b392';
        ctx.shadowColor = '#00ffcc';
        ctx.shadowBlur = index === 0 ? 8 : 0;
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
    });
    ctx.shadowBlur = 0;
}

function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);

    if (snake[0].x === food.x && snake[0].y === food.y) {
        score += 10;
        scoreEl.textContent = score;
        generateFood();
    } else {
        snake.pop();
    }
}

function generateFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
    
    snake.forEach(part => {
        if (part.x === food.x && part.y === food.y) {
            generateFood();
        }
    });
}

function drawFood() {
    ctx.fillStyle = '#ff007f';
    ctx.shadowColor = '#ff007f';
    ctx.shadowBlur = 10;
    ctx.fillRect(food.x * gridSize + 2, food.y * gridSize + 2, gridSize - 4, gridSize - 4);
    ctx.shadowBlur = 0;
}

function hasGameEnded() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    return snake[0].x < 0 || snake[0].x >= tileCount || snake[0].y < 0 || snake[0].y >= tileCount;
}

document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
    if (changingDirection) return;
    
    const keyPressed = event.keyCode;
    const LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40;
    const A = 65, W = 87, D = 68, S = 83;

    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;

    if ((keyPressed === LEFT || keyPressed === A) && !goingRight) { dx = -1; dy = 0; changingDirection = true; }
    if ((keyPressed === UP || keyPressed === W) && !goingDown) { dx = 0; dy = -1; changingDirection = true; }
    if ((keyPressed === RIGHT || keyPressed === D) && !goingLeft) { dx = 1; dy = 0; changingDirection = true; }
    if ((keyPressed === DOWN || keyPressed === S) && !goingUp) { dx = 0; dy = 1; changingDirection = true; }
}

startGame();
