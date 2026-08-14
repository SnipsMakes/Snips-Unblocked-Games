const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('highScore');

let score = 0;
let highScore = localStorage.getItem('invaders_highscore') || 0;
highScoreEl.textContent = highScore;

const player = {
    x: canvas.width / 2 - 15,
    y: canvas.height - 30,
    w: 30,
    h: 15,
    speed: 5,
    color: '#00ffcc'
};

let bullets = [];
let invaders = [];
const invaderRows = 4;
const invaderCols = 7;
const invaderWidth = 30;
const invaderHeight = 20;
const invaderPadding = 15;
const invaderOffsetTop = 40;
const invaderOffsetLeft = 35;

let invaderDirection = 1;
let invaderSpeed = 1;

function initInvaders() {
    invaders = [];
    for (let c = 0; c < invaderCols; c++) {
        for (let r = 0; r < invaderRows; r++) {
            const invaderX = (c * (invaderWidth + invaderPadding)) + invaderOffsetLeft;
            const invaderY = (r * (invaderHeight + invaderPadding)) + invaderOffsetTop;
            invaders.push({ x: invaderX, y: invaderY, status: 1 });
        }
    }
}

let keys = {};
document.addEventListener('keydown', e => keys[e.code] = true);
document.addEventListener('keyup', e => keys[e.code] = false);

document.addEventListener('keydown', e => {
    if (e.code === 'Space') {
        bullets.push({ x: player.x + player.w / 2 - 2, y: player.y, w: 4, h: 10, speed: 7 });
    }
});

function movePlayer() {
    if (keys['ArrowLeft'] || keys['KeyA']) player.x = Math.max(0, player.x - player.speed);
    if (keys['ArrowRight'] || keys['KeyD']) player.x = Math.min(canvas.width - player.w, player.x + player.speed);
}

function updateBullets() {
    bullets.forEach((b, index) => {
        b.y -= b.speed;
        if (b.y < 0) bullets.splice(index, 1);
    });
}

function updateInvaders() {
    let changeDir = false;
    invaders.forEach(inv => {
        if (!inv.status) return;
        inv.x += invaderSpeed * invaderDirection;
        if (inv.x + invaderWidth > canvas.width || inv.x < 0) {
            changeDir = true;
        }
    });

    if (changeDir) {
        invaderDirection *= -1;
        invaders.forEach(inv => {
            if (inv.status) inv.y += 15;
        });
    }
}

function checkCollisions() {
    bullets.forEach((b, bIdx) => {
        invaders.forEach((inv) => {
            if (!inv.status) return;
            if (b.x > inv.x && b.x < inv.x + invaderWidth && b.y > inv.y && b.y < inv.y + invaderHeight) {
                inv.status = 0;
                bullets.splice(bIdx, 1);
                score += 20;
                scoreEl.textContent = score;
            }
        });
    });

    // Verify game conditions
    let allDead = invaders.every(inv => inv.status === 0);
    if (allDead) {
        invaderSpeed += 0.5;
        initInvaders();
    }

    invaders.forEach(inv => {
        if (inv.status && inv.y + invaderHeight >= player.y) {
            gameOver();
        }
    });
}

function gameOver() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('invaders_highscore', highScore);
        highScoreEl.textContent = highScore;
    }
    alert("SYSTEM DEFENSE BREACHED! Restarting clean matrix state.");
    score = 0;
    scoreEl.textContent = score;
    invaderSpeed = 1;
    bullets = [];
    player.x = canvas.width / 2 - 15;
    initInvaders();
}

function drawGrid() {
    ctx.fillStyle = '#05070f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.shadowColor = player.color;
    ctx.shadowBlur = 10;
    ctx.fillRect(player.x, player.y, player.w, player.h);
    ctx.shadowBlur = 0;
}

function drawBullets() {
    ctx.fillStyle = '#ff00aa';
    bullets.forEach(b => ctx.fillRect(b.x, b.y, b.w, b.h));
}

function drawInvaders() {
    ctx.fillStyle = '#ff007f';
    ctx.shadowColor = '#ff007f';
    invaders.forEach(inv => {
        if (!inv.status) return;
        ctx.shadowBlur = 8;
        ctx.fillRect(inv.x, inv.y, invaderWidth, invaderHeight);
    });
    ctx.shadowBlur = 0;
}

function loop() {
    drawGrid();
    movePlayer();
    updateBullets();
    updateInvaders();
    checkCollisions();
    
    drawPlayer();
    drawBullets();
    drawInvaders();
    
    requestAnimationFrame(loop);
}

initInvaders();
loop();
