/**
 * Cyberpunk Snake Game
 * Author: Robin Kali (Generative AI Assistant)
 */

class SnakeGame {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        // Game Config
        this.gridSize = 20; // Size of one grid cell
        this.speed = 100;   // Game tick in ms (lower is faster)
        this.tileCount = 0; // Calculated based on canvas size

        // Game State
        this.score = 0;
        this.highScore = localStorage.getItem('snakeHighScore') || 0;
        this.snake = [];
        this.food = {};
        this.direction = { x: 0, y: 0 };
        this.nextDirection = { x: 0, y: 0 };
        this.running = false;
        this.gameInterval = null;

        // Setup DOM Elements
        this.wrapper = document.getElementById('snake-game-wrapper');
        this.scoreEl = document.getElementById('current-score');
        this.highScoreEl = document.getElementById('high-score');
        this.overlay = document.getElementById('game-overlay');
        this.overlayTitle = document.getElementById('overlay-title');
        this.overlayMsg = document.getElementById('overlay-msg');
        this.startBtn = document.getElementById('start-btn');

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Input Handling
        document.addEventListener('keydown', (e) => this.handleKey(e));

        // Mobile Swipe Handling
        this.setupTouchControls();

        this.startBtn.addEventListener('click', () => this.startGame());

        this.updateScoreDisplay();
        this.drawWelcomeScreen();
    }

    resize() {
        // Calculate wrapper width and set canvas size
        const wrapperWidth = this.wrapper.clientWidth;
        const wrapperHeight = this.wrapper.clientHeight || (wrapperWidth * 0.6); // Fallback aspect ratio

        // Make it a multiple of gridSize
        const tilesX = Math.floor(wrapperWidth / this.gridSize);
        const tilesY = Math.floor(wrapperHeight / this.gridSize);

        this.tileCount = Math.max(tilesX, 15);
        this.tileCountY = Math.max(tilesY, 15);

        // Set canvas resolution to match pixel grid
        this.canvas.width = this.tileCount * this.gridSize;
        this.canvas.height = this.tileCountY * this.gridSize;

        // Update wrapper height to match exact grid height if needed (avoids gaps)
        this.wrapper.style.height = `${this.canvas.height}px`;

        if (!this.running) {
            this.drawWelcomeScreen();
        } else {
            this.draw();
        }
    }

    setupTouchControls() {
        let touchStartX = 0;
        let touchStartY = 0;

        this.canvas.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
            e.preventDefault(); // Prevent scrolling
        }, { passive: false });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault(); // Prevent scrolling while playing
        }, { passive: false });

        this.canvas.addEventListener('touchend', (e) => {
            if (!this.running) return;

            const touchEndX = e.changedTouches[0].screenX;
            const touchEndY = e.changedTouches[0].screenY;

            const dx = touchEndX - touchStartX;
            const dy = touchEndY - touchStartY;

            if (Math.abs(dx) > Math.abs(dy)) {
                // Horizontal
                if (dx > 0) this.setDirection(1, 0); // Right
                else this.setDirection(-1, 0);       // Left
            } else {
                // Vertical
                if (dy > 0) this.setDirection(0, 1); // Down
                else this.setDirection(0, -1);       // Up
            }
        });
    }

    handleKey(e) {
        if (!this.running) {
            // Optional: Start on Space/Enter
            if (e.code === 'Space' || e.code === 'Enter') {
                this.startGame();
                e.preventDefault();
            }
            return;
        }

        switch (e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                this.setDirection(0, -1);
                e.preventDefault();
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                this.setDirection(0, 1);
                e.preventDefault();
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                this.setDirection(-1, 0);
                e.preventDefault();
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                this.setDirection(1, 0);
                e.preventDefault();
                break;
        }
    }

    setDirection(x, y) {
        // Prevent reversing directly
        if (this.direction.x === 0 && x !== 0 || this.direction.y === 0 && y !== 0) {
            // Prevent multiple moves in one tick
            // We use nextDirection to buffer the input until the next update
            // However, for simplicity handling current check against actual direction
            // A buffer could be added if rapid inputs cause deaths
            if (x === -this.direction.x && x !== 0) return;
            if (y === -this.direction.y && y !== 0) return;

            this.nextDirection = { x, y };
        }
    }

    startGame() {
        this.snake = [
            { x: 10, y: 10 },
            { x: 9, y: 10 },
            { x: 8, y: 10 },
        ];
        this.score = 0;
        this.direction = { x: 1, y: 0 }; // Start moving right
        this.nextDirection = { x: 1, y: 0 };
        this.running = true;
        this.updateScoreDisplay();
        this.overlay.classList.add('hidden');
        this.placeFood();

        if (this.gameInterval) clearInterval(this.gameInterval);
        this.gameInterval = setInterval(() => this.update(), this.speed);
    }

    gameOver() {
        this.running = false;
        clearInterval(this.gameInterval);

        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snakeHighScore', this.highScore);
            this.updateScoreDisplay();
            this.overlayMsg.textContent = `New High Score: ${this.score}!`;
        } else {
            this.overlayMsg.textContent = `Score: ${this.score} - Try Again?`;
        }

        this.overlayTitle.textContent = "SYSTEM FAILURE";
        this.startBtn.textContent = "REBOOT SYSTEM";
        this.overlay.classList.remove('hidden');
    }

    update() {
        this.direction = this.nextDirection;

        const head = { ...this.snake[0] };
        head.x += this.direction.x;
        head.y += this.direction.y;

        // Wall Collision
        if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCountY) {
            this.gameOver();
            return;
        }

        // Self Collision
        for (let part of this.snake) {
            if (head.x === part.x && head.y === part.y) {
                this.gameOver();
                return;
            }
        }

        this.snake.unshift(head);

        // Food Collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.updateScoreDisplay();
            this.placeFood();
            // Don't pop tail -> snake grows
        } else {
            this.snake.pop();
        }

        this.draw();
    }

    placeFood() {
        // Random position excluding snake body
        let valid = false;
        while (!valid) {
            this.food = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCountY)
            };

            valid = !this.snake.some(part => part.x === this.food.x && part.y === this.food.y);
        }
    }

    draw() {
        // Clear background
        this.ctx.fillStyle = '#0d0d12';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw Grid
        this.ctx.strokeStyle = '#1a1a2e';
        this.ctx.lineWidth = 1;
        for (let i = 0; i <= this.tileCount; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.gridSize, 0);
            this.ctx.lineTo(i * this.gridSize, this.canvas.height);
            this.ctx.stroke();
        }
        for (let j = 0; j <= this.tileCountY; j++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, j * this.gridSize);
            this.ctx.lineTo(this.canvas.width, j * this.gridSize);
            this.ctx.stroke();
        }

        // Draw Snake
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = '#1a9bc1'; // Brand Blue glow
        this.ctx.fillStyle = '#1a9bc1';

        this.snake.forEach((part, index) => {
            // Head is slightly brighter?
            if (index === 0) this.ctx.fillStyle = '#1a9bc1';
            else this.ctx.fillStyle = '#148aa8'; // Slightly darker for body

            this.ctx.fillRect(
                part.x * this.gridSize + 1,
                part.y * this.gridSize + 1,
                this.gridSize - 2,
                this.gridSize - 2
            );
        });

        // Draw Food
        this.ctx.shadowColor = '#ff00ff'; // Magenta glow
        this.ctx.fillStyle = '#ff00ff';
        this.ctx.beginPath();
        // Draw as circle/diamond for flair
        const foodX = this.food.x * this.gridSize + this.gridSize / 2;
        const foodY = this.food.y * this.gridSize + this.gridSize / 2;
        const r = this.gridSize / 2 - 2;

        this.ctx.arc(foodX, foodY, r, 0, Math.PI * 2);
        this.ctx.fill();

        // Reset Shadow
        this.ctx.shadowBlur = 0;
    }

    drawWelcomeScreen() {
        // Just clear and maybe show grid
        this.draw();
        // Text is handled by HTML overlay
    }

    updateScoreDisplay() {
        this.scoreEl.innerText = this.score;
        this.highScoreEl.innerText = this.highScore;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only init if the element exists
    if (document.getElementById('snake-game')) {
        const game = new SnakeGame('snake-game');
    }
});
