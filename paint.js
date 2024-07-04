const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = canvas.width = 1280;
const CANVAS_HEIGHT = canvas.height = 700;

let circleArr = [];

class Circle {
    constructor(X, Y, redd, colorr) {
        this.x = X;
        this.y = Y;
        this.redd = redd;
        this.colorr = colorr;
        this.delete = false;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.redd, 0, 2 * Math.PI);
        ctx.fillStyle = `#${this.colorr}`;
        ctx.fill();
    }
}

const drawCirc = (x, y, red) => {
    ctx.beginPath();
    ctx.arc(x, y, red, 0, 2 * Math.PI);
    ctx.stroke();
}

let x1, y1;
let image;
let isDrawing = false;
let flag = false;
let message = '';
let messageX = 0;
let messageY = 0;

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    x1 = e.offsetX;
    y1 = e.offsetY;
    image = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
})

canvas.addEventListener('mousemove', (e) => {
    if (isDrawing) {
        flag = true;
        ctx.putImageData(image, 0, 0);
        const rad = Math.abs(x1 - e.offsetX) > Math.abs(y1 - e.offsetY) ?
            Math.abs(x1 - e.offsetX) : Math.abs(y1 - e.offsetY);
        const x = x1;
        const y = y1;
        drawCirc(x, y, rad);
    }
})

canvas.addEventListener('mouseup', (e) => {
    if (isDrawing && flag) {
        const rad = Math.abs(x1 - e.offsetX) > Math.abs(y1 - e.offsetY) ?
            Math.abs(x1 - e.offsetX) : Math.abs(y1 - e.offsetY);
        const x = x1;
        const y = y1;
        const colorr = Math.floor(Math.random() * 16777215).toString(16);
        circleArr.push(new Circle(x, y, rad, colorr));
    }
    if (!flag) {
        const rect = canvas.getBoundingClientRect();
        const currX = e.clientX - rect.left;
        const currY = e.clientY - rect.top;
        let hit = false;

        if (circleArr.length >= 1) {
            circleArr.forEach(circ => {
                const distance = Math.sqrt((currX - circ.x) ** 2 + (currY - circ.y) ** 2);
                if (distance <= circ.redd) {
                    hit = true;
                }
            });
        }

        ctx.putImageData(image, 0, 0);
        ctx.font = '20px Arial';
        ctx.fillStyle = 'black';
        if (hit) {
            message = 'Hit';
            messageX = currX;
            messageY = currY;
        } else {
            message = 'Miss';
            messageX = currX;
            messageY = currY;
        }
    }
    isDrawing = false;
    flag = false;
})

canvas.addEventListener('dblclick',(e)=>{
    const x2 = e.offsetX;
    const y2 = e.offsetY;
    circleArr.forEach(circ => {
        const distance = Math.sqrt((x2 - circ.x) ** 2 + (y2 - circ.y) ** 2);
        if (distance <= circ.redd) {
            circ.delete = true;
        }
    });
    message = '';
})

const animate = () => {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    circleArr = circleArr.filter(c=> c.delete === false);
    for (let i = 0; i < circleArr.length; i++) {
        circleArr[i].draw();
    }
    if (message) {
        ctx.font = '20px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText(message, messageX, messageY);
    }
    requestAnimationFrame(animate);
}
animate();

const reset = document.getElementById('resetButton');
reset.addEventListener('click', () => {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    circleArr.length = 0;
    message = '';
});