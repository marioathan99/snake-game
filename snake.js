const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const grid = 20;
let count = 0;
let snake = [{ x: 160, y: 160 }];
let dx = grid;
let dy = 0;
let food = { x: 320, y: 320 };
let gameOver = false;
let score = 0;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function resetFood() {
    food.x = getRandomInt(0, canvas.width / grid) * grid;
    food.y = getRandomInt(0, canvas.height / grid) * grid;
}

function updateScore() {
    document.getElementById('score').textContent = 'Score: ' + score;
}

function gameLoop() {
    if (gameOver) return;

    requestAnimationFrame(gameLoop);

    if (++count < 8) return;
    count = 0;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move snake
    let head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Wrap snake position if it goes out of bounds
    if (head.x < 0) head.x = canvas.width - grid;
    else if (head.x >= canvas.width) head.x = 0;
    if (head.y < 0) head.y = canvas.height - grid;
    else if (head.y >= canvas.height) head.y = 0;

    // Game over condition: snake runs into itself
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver = true;
        ctx.fillStyle = 'red';
        ctx.font = '32px Arial';
        ctx.fillText('Game Over!', 110, 200);
        return;
    }

    snake.unshift(head);

    // Eat food
    if (head.x === food.x && head.y === food.y) {
        score++;
        updateScore();
        resetFood();
    } else {
        snake.pop();
    }

    // Draw food
    ctx.fillStyle = 'lime';
    ctx.fillRect(food.x, food.y, grid - 2, grid - 2);

    // Draw snake
    ctx.fillStyle = 'yellow';
    snake.forEach(segment => ctx.fillRect(segment.x, segment.y, grid - 2, grid - 2));
}

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' && dx === 0) {
        dx = -grid; dy = 0;
    } else if (e.key === 'ArrowUp' && dy === 0) {
        dx = 0; dy = -grid;
    } else if (e.key === 'ArrowRight' && dx === 0) {
        dx = grid; dy = 0;
    } else if (e.key === 'ArrowDown' && dy === 0) {
        dx = 0; dy = grid;
    }
});

resetFood();
updateScore();
requestAnimationFrame(gameLoop);