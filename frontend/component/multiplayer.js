class MultiPlayer extends HTMLElement {
    constructor() {
        super();
        this.canvas = null;
        this.ctx = null;
        this.gameSize = 800;
        this.ball = { x: this.gameSize / 2, y: this.gameSize / 2, radius: 15, dx: 7, dy: 7 };
        this.paddles = [
            { x: 0, y: this.gameSize / 2 - 75, width: 20, height: 150 },
            { x: this.gameSize - 20, y: this.gameSize / 2 - 75, width: 20, height: 150 },
            { x: this.gameSize / 2 - 75, y: 0, width: 150, height: 20 },
            { x: this.gameSize / 2 - 75, y: this.gameSize - 20, width: 150, height: 20 }
        ];
        this.cornerBounceZone = this.gameSize * 0.1;
        this.keys = {};
        this.paddleSpeed = 8;
        this.teamScores = [0, 0];
        this.teamNames = ['', ''];
        this.gameStarted = false;
        this.colors = ['red', 'blue', 'red', 'blue'];

        window.onbeforeunload = () => "Are you sure you want to leave the game?";
    }

    connectedCallback() {
        this.showRegistrationPopup();
    }

    showRegistrationPopup() {
        this.innerHTML = `
            <div class="login-container">
                <h2>Team Registration</h2>
                <div class="form-group">
                    <input type="text" id="team1Name" placeholder="Team 1 Name">
                    <input type="text" id="team2Name" placeholder="Team 2 Name">
                </div>
                <button class="btn" id="registerTeams">Start Game</button>
            </div>
        `;
        this.querySelector('#registerTeams').addEventListener('click', this.registerTeams.bind(this));
    }

    registerTeams() {
        const team1Name = this.querySelector('#team1Name').value.trim();
        const team2Name = this.querySelector('#team2Name').value.trim();

        if (team1Name === '' || team2Name === '') {
            alert('Both teams must have a name.');
            return;
        }

        if (team1Name === team2Name) {
            alert('Team names must be different.');
            return;
        }

        this.teamNames = [team1Name, team2Name];
        this.startNewGame();
    }

    startNewGame() {
        this.teamScores = [0, 0];
        this.resetBall();
        this.resetPaddles();
        this.renderGame();
        this.gameStarted = true;
        this.gameLoop(); 
    }

    renderGame() {
        this.innerHTML = `
            <div id="gameArea">
                <div class="score-container" id="scoreBoard">
                    <span class="score" id="team1Score" style="color:red">${this.teamNames[0]}: 0</span> |
                    <span class="score" id="team2Score" style="color:blue">${this.teamNames[1]}: 0</span>
                </div>
                <canvas id="pongCanvas" width="${this.gameSize}" height="${this.gameSize}"></canvas>
                <div id="controls">
                    <p>Controls:</p>
                    <p>Player 1 (Left): Q (up), A (down)</p>
                    <p>Player 2 (Right): P (up), L (down)</p>
                    <p>Player 3 (Top): R (left), T (right)</p>
                    <p>Player 4 (Bottom): U (left), O (right)</p>
                </div>
            </div>
        `;

        this.canvas = this.querySelector('#pongCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.addEventListener('keyup', this.handleKeyUp.bind(this));
    }

    resetPaddles() {
        this.paddles = [
            { x: 0, y: this.gameSize / 2 - 75, width: 20, height: 150, team: 0 },
            { x: this.gameSize - 20, y: this.gameSize / 2 - 75, width: 20, height: 150, team: 1 },
            { x: this.gameSize / 2 - 75, y: 0, width: 150, height: 20, team: 0 },
            { x: this.gameSize / 2 - 75, y: this.gameSize - 20, width: 150, height: 20, team: 1 }
        ];
    }

    handleKeyDown(e) {
        this.keys[e.key.toLowerCase()] = true;
    }

    handleKeyUp(e) {
        this.keys[e.key.toLowerCase()] = false;
    }

    update() {
        this.movePaddles();
        this.moveBall();
        this.checkCollisions();
        this.updateScoreDisplay();

        if (this.teamScores.some(score => score >= 10)) {
            this.showWinnerPopup();
        }
    }

    movePaddles() {
        if (this.keys['q'] && this.paddles[0].y > 0) this.paddles[0].y -= this.paddleSpeed;
        if (this.keys['a'] && this.paddles[0].y < this.gameSize - this.paddles[0].height) this.paddles[0].y += this.paddleSpeed;
        if (this.keys['9'] && this.paddles[1].y > 0) this.paddles[1].y -= this.paddleSpeed;
        if (this.keys['6'] && this.paddles[1].y < this.gameSize - this.paddles[1].height) this.paddles[1].y += this.paddleSpeed;
        if (this.keys['o'] && this.paddles[2].x > 0) this.paddles[2].x -= this.paddleSpeed;
        if (this.keys['l'] && this.paddles[2].x < this.gameSize - this.paddles[2].width) this.paddles[2].x += this.paddleSpeed;
        if (this.keys['4'] && this.paddles[3].x > 0) this.paddles[3].x -= this.paddleSpeed;
        if (this.keys['1'] && this.paddles[3].x < this.gameSize - this.paddles[3].width) this.paddles[3].x += this.paddleSpeed;
    }

    moveBall() {
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;
    }

    checkCollisions() {
        // Check paddle collisions
        for (let i = 0; i < this.paddles.length; i++) {
            if (this.checkPaddleCollision(this.ball.x, this.ball.y, this.paddles[i])) {
                this.handlePaddleCollision(i);
                return;
            }
        }

        // Check wall collisions (including corner bounce zones)
        this.checkWallCollision(this.ball.x + this.ball.dx, this.ball.y + this.ball.dy);
    }

    checkWallCollision(nextX, nextY) {
        const cornerZone = this.cornerBounceZone;  // 10% of the game size

        // Left and right boundary collisions
        if (nextX - this.ball.radius <= 0) {
            if (nextY <= cornerZone || nextY >= this.gameSize - cornerZone) {
                this.ball.dx = Math.abs(this.ball.dx);  // Left bounce
            } else {
                this.teamScores[1]++;
                this.resetBall();
            }
        } else if (nextX + this.ball.radius >= this.gameSize) {
            if (nextY <= cornerZone || nextY >= this.gameSize - cornerZone) {
                this.ball.dx = -Math.abs(this.ball.dx);  // Right bounce
            } else {
                this.teamScores[0]++;
                this.resetBall();
            }
        }

        // Top and bottom boundary collisions
        if (nextY - this.ball.radius <= 0) {
            if (nextX <= cornerZone || nextX >= this.gameSize - cornerZone) {
                this.ball.dy = Math.abs(this.ball.dy);  // Top bounce
            } else {
                this.teamScores[1]++;
                this.resetBall();
            }
        } else if (nextY + this.ball.radius >= this.gameSize) {
            if (nextX <= cornerZone || nextX >= this.gameSize - cornerZone) {
                this.ball.dy = -Math.abs(this.ball.dy);  // Bottom bounce
            } else {
                this.teamScores[0]++;
                this.resetBall();
            }
        }
    }

    checkPaddleCollision(x, y, paddle) {
        return (x - this.ball.radius < paddle.x + paddle.width &&
                x + this.ball.radius > paddle.x &&
                y + this.ball.radius > paddle.y &&
                y - this.ball.radius < paddle.y + paddle.height);
    }

    handlePaddleCollision(paddleIndex) {
        const paddle = this.paddles[paddleIndex];
        
        // Calculate collision point
        const collisionPoint = paddleIndex < 2 ? 
            (this.ball.y - paddle.y) / paddle.height :
            (this.ball.x - paddle.x) / paddle.width;
    
        // Adjust angle based on where the ball hit the paddle
        const angleRange = Math.PI / 4; // 45 degrees
        const baseAngle = paddleIndex < 2 ? 0 : Math.PI / 2;
        const angle = baseAngle + (collisionPoint - 0.5) * angleRange;
    
        // Set new velocity with a slight speed increase
        const speed = Math.sqrt(this.ball.dx * this.ball.dx + this.ball.dy * this.ball.dy) * 1.05;
        
        if (paddleIndex < 2) {
            // Vertical paddles (left and right)
            this.ball.dx = Math.cos(angle) * speed * (paddleIndex === 0 ? 1 : -1);
            this.ball.dy = Math.sin(angle) * speed;
        } else {
            // Horizontal paddles (top and bottom)
            this.ball.dx = Math.cos(angle) * speed;
            this.ball.dy = Math.sin(angle) * speed * (paddleIndex === 2 ? 1 : -1);
        }
    
        // Adjust ball position to prevent sticking
        const offset = this.ball.radius + 1; // Add 1 pixel to ensure separation
        if (paddleIndex === 2) {  // Upper green paddle
            this.ball.y = paddle.y + paddle.height + offset;
        } else if (paddleIndex === 3) {  // Bottom purple paddle
            this.ball.y = paddle.y - offset;
        } else if (paddleIndex === 0) {  // Left red paddle
            this.ball.x = paddle.x + paddle.width + offset;
        } else if (paddleIndex === 1) {  // Right blue paddle
            this.ball.x = paddle.x - offset;
        }
    
        // Add a tiny random factor to prevent the ball from getting stuck in a loop
        this.ball.dx += (Math.random() - 0.5) * 0.2;
        this.ball.dy += (Math.random() - 0.5) * 0.2;
    }

    resetBall() {
        this.ball.x = this.gameSize / 2;
        this.ball.y = this.gameSize / 2;
        const angle = Math.random() * Math.PI * 2;
        const speed = 5;
        this.ball.dx = Math.cos(angle) * speed;
        this.ball.dy = Math.sin(angle) * speed;
    }

    draw() {
        // Clear the canvas
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.gameSize, this.gameSize);

        // Draw game boundary
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(0, 0, this.gameSize, this.gameSize);
 
        // Draw paddles
        this.paddles.forEach((paddle, index) => {
            this.ctx.fillStyle = this.colors[index];
            this.ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
        });
 
        // Draw ball
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = 'white';
        this.ctx.fill();
    }

    updateScoreDisplay() {
        this.querySelector('#team1Score').textContent = `${this.teamNames[0]}: ${this.teamScores[0]}`;
        this.querySelector('#team2Score').textContent = `${this.teamNames[1]}: ${this.teamScores[1]}`;
    }

    gameLoop() {
        if (!this.gameStarted) return;
        
        this.update();
        this.draw();
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    showWinnerPopup() {
        this.gameStarted = false;
        const winnerIndex = this.teamScores[0] > this.teamScores[1] ? 0 : 1;
        this.innerHTML = `
        <div class="login-container">
            <h2 class="login-title">Game Over</h2>
            <p class="word">${this.teamNames[winnerIndex]} wins!</p>
            <button class="btn" id="restartGame">Play Again</button>
            <button class="btn" id="returnToDashboard">Return to Dashboard</button>
        </div>
        `;
        this.querySelector('#restartGame').addEventListener('click', () => this.startNewGame());
        this.querySelector('#returnToDashboard').addEventListener('click', this.returnToDashboard.bind(this));
    }

    returnToDashboard() {
        window.onbeforeunload = null;
        window.location.hash = '#dashboard';
    }
}

customElements.define('pong-multiplayer', MultiPlayer);