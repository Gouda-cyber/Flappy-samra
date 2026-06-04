const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const birdImg = new Image();
birdImg.src = "samra.png";

const bgImg = new Image();
bgImg.src = "masrawy.png";

const pipeImg = new Image();
pipeImg.src = "tea.png";

let bird = {
    x: 80,
    y: 250,
    width: 50,
    height: 40,
    velocity: 0
};

let gravity = 0.5;
let jump = -8;

let pipes = [];

let score = 0;

function createPipe(){
    let gap = 170;

    let topHeight =
        Math.random() * 250 + 50;

    pipes.push({
        x: canvas.width,
        topHeight: topHeight,
        gap: gap,
        counted:false
    });
}

setInterval(createPipe, 2000);

document.addEventListener("keydown", ()=>{
    bird.velocity = jump;
});

document.addEventListener("click", ()=>{
    bird.velocity = jump;
});

function update(){

    bird.velocity += gravity;
    bird.y += bird.velocity;

    if(bird.y < 0){
        bird.y = 0;
    }

    for(let i=0;i<pipes.length;i++){

        pipes[i].x -= 3;

        if(
            bird.x + bird.width > pipes[i].x &&
            bird.x < pipes[i].x + 70 &&
            (
                bird.y < pipes[i].topHeight ||
                bird.y + bird.height >
                pipes[i].topHeight + pipes[i].gap
            )
        ){
            location.reload();
        }

        if(
            !pipes[i].counted &&
            pipes[i].x + 70 < bird.x
        ){
            score++;
            pipes[i].counted = true;
        }
    }

    if(
        bird.y + bird.height >
        canvas.height
    ){
        location.reload();
    }

    pipes = pipes.filter(pipe => pipe.x > -100);
}

function draw(){

    ctx.drawImage(
        bgImg,
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.drawImage(
        birdImg,
        bird.x,
        bird.y,
        bird.width,
        bird.height
    );

    pipes.forEach(pipe=>{

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
            -(
                canvas.height -
                pipe.topHeight -
                pipe.gap
            ),
            70,
            canvas.height -
            pipe.topHeight -
            pipe.gap
        );

        ctx.restore();
    });

    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText(
        "Score: " + score,
        10,
        40
    );
}

function gameLoop(){

    update();

    draw();

    requestAnimationFrame(gameLoop);
}

gameLoop();
