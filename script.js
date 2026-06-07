const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startBtn = document.getElementById("startBtn");

const birdImg = new Image();
birdImg.src = "Goda.png";

const bgImg = new Image();
bgImg.src = "masrawy.png";

const pipeImg = new Image();
pipeImg.src = "Rawan.png";

let gameStarted = false;

let bird = {
    x: 80,
    y: 250,
    width: 60,
    height: 60,
    velocity: 0
};

let gravity = 0.35;
let jump = -7;

let pipes = [];
let score = 0;

function resetGame() {
    bird.x = 80;
    bird.y = 250;
    bird.velocity = 0;

    pipes = [];
    score = 0;

    gameStarted = false;
    startBtn.style.display = "block";
}

startBtn.addEventListener("click", () => {
    resetGame();
    gameStarted = true;
    startBtn.style.display = "none";
});

function createPipe() {

    if (!gameStarted) return;

    let gap = 220;

    let topHeight =
        Math.random() * 200 + 50;

    pipes.push({
        x: canvas.width,
        topHeight: topHeight,
        gap: gap,
        counted: false
    });
}

setInterval(createPipe, 2500);

document.addEventListener("click", () => {
    if(gameStarted){
        bird.velocity = jump;
    }
});

document.addEventListener("keydown", (e) => {
    if(e.code === "Space" && gameStarted){
        bird.velocity = jump;
    }
});

function update() {

    if (!gameStarted) return;

    bird.velocity += gravity;
    bird.y += bird.velocity;

    if (
        bird.y < 0 ||
        bird.y + bird.height > canvas.height
    ) {
        resetGame();
        return;
    }

    for(let i=0;i<pipes.length;i++){

        pipes[i].x -= 2;

        if(
            bird.x + bird.width > pipes[i].x &&
            bird.x < pipes[i].x + 70 &&
            (
                bird.y < pipes[i].topHeight ||
                bird.y + bird.height >
                pipes[i].topHeight + pipes[i].gap
            )
        ){
            resetGame();
            return;
        }

        if(
            !pipes[i].counted &&
            pipes[i].x + 70 < bird.x
        ){
            score++;
            pipes[i].counted = true;
        }
    }

    pipes = pipes.filter(
        pipe => pipe.x > -100
    );
}

function draw() {

    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.drawImage(
        bgImg,
        0,
        0,
        canvas.width,
        canvas.height
    );

    pipes.forEach(pipe => {

        ctx.drawImage(
            pipeImg,
            pipe.x,
            0,
            70,
            pipe.topHeight
        );

        ctx.save();

        ctx.translate(
            pipe.x + 70,
            pipe.topHeight + pipe.gap
        );

        ctx.scale(1,-1);

        ctx.drawImage(
            pipeImg,
            -70,
            -(canvas.height -
            pipe.topHeight -
            pipe.gap),
            70,
            canvas.height -
            pipe.topHeight -
            pipe.gap
        );

        ctx.restore();
    });

    ctx.drawImage(
        birdImg,
        bird.x,
        bird.y,
        bird.width,
        bird.height
    );

    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText(
        "Score: " + score,
        10,
        40
    );
}

function gameLoop() {

    update();
    draw();

    requestAnimationFrame(gameLoop);
}

gameLoop();

