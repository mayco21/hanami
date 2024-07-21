let canvas, ctx;
let windowWidth, windowHeight;
let backgroundImage;
let hairColorToggle = true;
let dpr = window.devicePixelRatio || 1;

function setupCanvas() {
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    document.body.appendChild(canvas);
    
    updateCanvasSize();
    
    console.log(`חלון הדפדפן: ${windowWidth}px רוחב, ${windowHeight}px גובה`);
    console.log(`רזולוציית קנבס: ${canvas.width}x${canvas.height}`);
}

function updateCanvasSize() {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    
    canvas.width = windowWidth * dpr;
    canvas.height = windowHeight * dpr;
    canvas.style.width = windowWidth + 'px';
    canvas.style.height = windowHeight + 'px';
    
    ctx.scale(dpr, dpr);
}

function loadBackgroundImage() {
    backgroundImage = new Image();
    backgroundImage.onload = function() {
        drawBackground();
    };
    backgroundImage.src = 'BG.jpg';
    backgroundImage.onerror = function() {
        console.error('שגיאה בטעינת תמונת הרקע');
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    };
}

function drawBackground() {
    if (!backgroundImage.complete) {
        console.log('תמונת הרקע עדיין לא נטענה');
        return;
    }
    const imgRatio = backgroundImage.width / backgroundImage.height;
    const canvasRatio = windowWidth / windowHeight;
    let drawWidth, drawHeight, offsetX = 0, offsetY = 0;

    if (canvasRatio > imgRatio) {
        drawWidth = windowWidth;
        drawHeight = windowWidth / imgRatio;
        offsetY = (windowHeight - drawHeight) / 2;
    } else {
        drawHeight = windowHeight;
        drawWidth = windowHeight * imgRatio;
        offsetX = (windowWidth - drawWidth) / 2;
    }

    ctx.drawImage(backgroundImage, offsetX, offsetY, drawWidth, drawHeight);
}

function drawWavyHair(x, frames, color, width) {
    const amplitude = 20;
    const frequency = 0.02;
    const speed = 2;
    
    ctx.beginPath();
    ctx.moveTo(x, 0);
    
    for (let y = 0; y <= frames; y += speed) {
        const newX = x + Math.sin(y * frequency) * amplitude;
        ctx.lineTo(newX, y);
    }
    
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
}

function animateHair(x) {
    let frames = 0;
    const totalFrames = windowHeight;
    const color = hairColorToggle ? '#2A398A' : '#F26457';
    const width = Math.random() * 3 + 1;
    
    function animate() {
        if (frames <= totalFrames) {
            drawWavyHair(x, frames, color, width);
            frames += 2;
            requestAnimationFrame(animate);
        }
    }
    
    animate();
    hairColorToggle = !hairColorToggle;
}

function resetCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
}

setupCanvas();
loadBackgroundImage();

window.addEventListener('resize', function() {
    updateCanvasSize();
    drawBackground();
});

canvas.addEventListener('click', function(event) {
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * dpr;
    animateHair(x);
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'r' || event.key === 'R') {
        event.preventDefault();
        resetCanvas();
    }
});