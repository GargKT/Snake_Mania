// index.js

// Game Constants
let inputDir = { x: 0, y: 0 };
const foodSound = new Audio('../music/food.mp3');
const gameOverSound = new Audio('../music/gameover.mp3');
const moveSound = new Audio('../music/move.mp3');
const musicSound = new Audio('../music/music.mp3');
let speed = 5;
let lastPaintTime = 0;
let snakeArr = [
    { x: 13, y: 15 }
];
let food = { x: 6, y: 7 };
let score = 0;

// Game Function
function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake) {
    // If bump into yourself
    for (let i = 1; i < snake.length; i++) {
        if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
            return true;
        }
    }
    // If bump into the wall
    if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) {
        return true;
    }
    return false;
}

function gameEngine() {
    // Part 1: Updating snake array and food
    if (isCollide(snakeArr)) {
        gameOverSound.play();
        musicSound.pause();
        inputDir = { x: 0, y: 0 };
        alert('Game Over! Press any key to move again!');
        snakeArr = [{ x: 13, y: 15 }];
        food = { x: 6, y: 7 };  // Reset the food position
        score = 0;
        setTimeout(() => {
            musicSound.currentTime = 0;  // Restart the background music
            musicSound.play();
        }, 1000);  // Delay to avoid overlapping sounds
        return;
    }

    // If you have eaten the food, increment score and regenerate food
    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        foodSound.play();
        score++;
        if(score>hiscoreval){
            hiscoreval = score;
            localStorage.setItem("hiscore",JSON.stringify(hiscoreval));
            hiscoreBox.innerHTML = "High Score : " + hiscoreval;
        }
        scoreBox.innerHTML = "Score : " +score;
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        let a = 2;
        let b = 16;
        food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };
    }

    // Moving the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Part 2: Display the snake and food
    const board = document.getElementById('board');
    board.innerHTML = "";

    // Display snake
    snakeArr.forEach((e, index) => {
        const snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;

        if (index === 0) {
            snakeElement.classList.add('head');
        } else {
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
    });

    // Display food
    const foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

// Main logic
let hiscore = localStorage.getItem("hiscore");
if(hiscore === null){
    hiscoreval = 0;
    localStorage.setItem("hiscore",JSON.stringify(hiscoreval));
}
else{
    hiscoreval = JSON.parse(hiscore);
    hiscoreBox.innerHTML = "High Score : " + hiscore;
}

window.requestAnimationFrame(main);

window.addEventListener('keydown', e => {
    // Change direction based on key press
    switch (e.key) {
        case 'ArrowUp':
            if (inputDir.y !== 1) { // Prevent snake from reversing
                inputDir = { x: 0, y: -1 };
                moveSound.play();
            }
            break;
        case 'ArrowDown':
            if (inputDir.y !== -1) {
                inputDir = { x: 0, y: 1 };
                moveSound.play();
            }
            break;
        case 'ArrowLeft':
            if (inputDir.x !== 1) {
                inputDir = { x: -1, y: 0 };
                moveSound.play();
            }
            break;
        case 'ArrowRight':
            if (inputDir.x !== -1) {
                inputDir = { x: 1, y: 0 };
                moveSound.play();
            }
            break;
        default:
            break;
    }
    if (musicSound.paused) {
        musicSound.play();
    }
});
