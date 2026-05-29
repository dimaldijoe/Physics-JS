const canvas = document.getElementById("physics-canvas");
const ctx = canvas.getContext("2d");

// Resize canvas to fill the screen dynamically
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Simulation parameters configuration
let gravity = 0.5;
const bounce = 0.9;

// Connect UI elements to configuration parameters
const gravitySlider = document.getElementById("gravity-slider");
const gravityVal = document.getElementById("gravity-val");
gravitySlider.addEventListener("input", (e) => {
    gravity = parseFloat(e.target.value);
    gravityVal.innerText = gravity.toFixed(1);
});

// Verlet Physics Object Definition
class PhysicsPoint {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.oldX = x;
        this.oldY = y;
    }

    update() {
        // Compute structural velocity implicitly via previous frames
        const vx = this.x - this.oldX;
        const vy = this.y - this.oldY;

        this.oldX = this.x;
        this.oldY = this.y;

        // Apply equations of motion with external acceleration vectors
        this.x += vx;
        this.y += vy + gravity;
    }

    constrainToScreen() {
        const vx = this.x - this.oldX;
        const vy = this.y - this.oldY;

        // Screen boundary collision mechanics
        if (this.y > canvas.height - 15) {
            this.y = canvas.height - 15;
            this.oldY = this.y + vy * bounce;
        }
        if (this.x > canvas.width - 15) {
            this.x = canvas.width - 15;
            this.oldX = this.x + vx * bounce;
        }
        if (this.x < 15) {
            this.x = 15;
            this.oldX = this.x + vx * bounce;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 15, 0, Math.PI * 2);
        ctx.fillStyle = "#ec3750"; // Brand-aligned visual element
        ctx.fill();
        ctx.closePath();
    }
}

// Instantiate simulation objects
const dynamicNode = new PhysicsPoint(canvas.width / 2, 100);

// Basic user interface pointer tracking configurations
let isDragging = false;
window.addEventListener("mousedown", (e) => {
    const dist = Math.hypot(e.clientX - dynamicNode.x, e.clientY - dynamicNode.y);
    if (dist < 30) isDragging = true;
});
window.addEventListener("mousemove", (e) => {
    if (isDragging) {
        dynamicNode.x = e.clientX;
        dynamicNode.y = e.clientY;
    }
});
window.addEventListener("mouseup", () => isDragging = false);

// Principal engineering engine state cycle execution loop
function engineCycle() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!isDragging) {
        dynamicNode.update();
        dynamicNode.constrainToScreen();
    } else {
        // Keep velocities consistent while dragged
        dynamicNode.oldX = dynamicNode.x;
        dynamicNode.oldY = dynamicNode.y;
    }

    dynamicNode.draw();
    requestAnimationFrame(engineCycle);
}

// Fire engine thread execution lifecycle
engineCycle();
