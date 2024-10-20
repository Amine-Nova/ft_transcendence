class PongGame extends HTMLElement {
    constructor() {
        super();
        this.canvas = null;
        this.ctx = null;
        this.ball = { x: 500, y: 250, radius: 10, dx: 5, dy: 5 };
        this.paddle1 = { x: 10, y: 200, width: 10, height: 120 };  
        this.paddle2 = { x: 980, y: 200, width: 10, height: 120 };  
        this.keys = {};
        this.paddleSpeed = 7;
        this.score1 = 0;
        this.score2 = 0;
        this.player1Name = '';
        this.player2Name = '';
        this.gameStarted = false;
        this.tournamentMode = false;
    

        window.onbeforeunload = () => {
            return "Are you sure you want to leave the game?";
        };
    }

    connectedCallback() {
        this.tournamentMode = localStorage.getItem('pongTournamentMode') === 'true';
        if (this.tournamentMode) {
            this.player1Name = String(localStorage.getItem('pongPlayer1Name') || 'Player 1');
            this.player2Name = String(localStorage.getItem('pongPlayer2Name') || 'Player 2');
            this.startGame();
        } else {
            this.showRegistrationPopup();
        }
    }

    showRegistrationPopup() {
        this.innerHTML = `
        <div class="login-container">
            <h2 data-i18n="Player Registration"></h2>
            <div class="form-group">
                <label data-i18n="First Player Name"></label> 
                <input type="text" id="player1Name">
                <label data-i18n="Second Player Name"></label> 
                <input type="text" id="player2Name">
            </div>
            <button class="btn" id="registerPlayers" data-i18n="Register"></button>
        </div>
        `;
        changeLanguage(localStorage.getItem('preferredLanguage') || 'en');
        this.querySelector('#registerPlayers').addEventListener('click', this.registerPlayers.bind(this));
    }

    registerPlayers() {
        const player1Input = this.querySelector('#player1Name');
        const player2Input = this.querySelector('#player2Name');
        
        const player1Name = player1Input.value.trim();
        const player2Name = player2Input.value.trim();
        
        if (player1Name === '' || player2Name === '') {
            alert('Both players must enter a name.');
            return;
        }
    
        if (player1Name === player2Name) {
            alert('Player names must be different.');
            return;
        }
    
        this.player1Name = player1Name;
        this.player2Name = player2Name;
    
        localStorage.setItem('pongPlayer1Name', this.player1Name);
        localStorage.setItem('pongPlayer2Name', this.player2Name);
    
        this.showMatchmakingWindow();
    }

    showMatchmakingWindow() {
        this.innerHTML = `
        <div class="login-container">
            <div class="popup">
                <h2 class="signup-title" data-i18n="Matchmaking"></h2>
                <div class="player-info">
                    <span  data-i18n="Player 1: "></span>
                    <span > ${this.player1Name} </span>
                </div>
                <div class="player-info">
                    <span data-i18n="Player 2: "></span>
                    <span > ${this.player2Name} </span>
                </div>
                <button class="btn" id="startGame" data-i18n="Start Game"></button>
            </div>
            </div>
        `;
        changeLanguage(localStorage.getItem('preferredLanguage') || 'en');
        this.querySelector('#startGame').addEventListener('click', this.startGame.bind(this));
    }

    startGame() {
        this.innerHTML = `
            <div id="gameArea">
                <div class="score-container" id="scoreBoard">
                    <span class="score" id="player1Score">${this.player1Name}: 0</span> -
                    <span class="score" id="player2Score">${this.player2Name}: 0</span>
                </div>
                <canvas id="pongCanvas" width="1000" height="500"></canvas>
            </div>
        `;

        this.canvas = this.querySelector('#pongCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.addEventListener('keyup', this.handleKeyUp.bind(this));
        
        this.gameStarted = true;
        this.gameLoop();
    }

    handleKeyDown(e) {
        this.keys[e.key] = true;
    }

    handleKeyUp(e) {
        this.keys[e.key] = false;
    }

    update() {
        // Move paddles
        if (this.keys['w'] && this.paddle1.y > 0) this.paddle1.y -= this.paddleSpeed;  // Move faster
        if (this.keys['s'] && this.paddle1.y < this.canvas.height - this.paddle1.height) this.paddle1.y += this.paddleSpeed;  // Move faster
        if (this.keys['ArrowUp'] && this.paddle2.y > 0) this.paddle2.y -= this.paddleSpeed;  // Move faster
        if (this.keys['ArrowDown'] && this.paddle2.y < this.canvas.height - this.paddle2.height) this.paddle2.y += this.paddleSpeed;  // Move faster
    
        // Move ball
        let nextX = this.ball.x + this.ball.dx;
        let nextY = this.ball.y + this.ball.dy;
    
        // Ball collision with top and bottom
        if (nextY - this.ball.radius < 0 || nextY + this.ball.radius > this.canvas.height) {
            this.ball.dy *= -1;
            nextY = this.ball.y + this.ball.dy;
        }
    
        // Improved paddle collision detection (other code remains unchanged)
        if (this.checkPaddleCollision(nextX, nextY, this.paddle1) || 
            this.checkPaddleCollision(nextX, nextY, this.paddle2)) {
            this.ball.dx *= -1;
            this.ball.dy += (Math.random() - 0.5) * 2;
        }
    
        // Update ball position
        this.ball.x = nextX;
        this.ball.y = nextY;
    
        // Ball out of bounds, score logic...
    
    

        // Ball out of bounds
        if (this.ball.x < 0) {
            this.score2++;
            this.resetBall();
        } else if (this.ball.x > this.canvas.width) {
            this.score1++;
            this.resetBall();
        }

        this.updateScoreDisplay();

        // Check for winner
        if (this.score1 >= 3 || this.score2 >= 3) {
            this.showWinnerPopup();
        }
    }

    checkPaddleCollision(nextX, nextY, paddle) {
        return (nextX - this.ball.radius < paddle.x + paddle.width &&
                nextX + this.ball.radius > paddle.x &&
                nextY + this.ball.radius > paddle.y &&
                nextY - this.ball.radius < paddle.y + paddle.height);
    }

     resetBall() {
        this.ball.x = this.canvas.width / 2;
        this.ball.y = this.canvas.height / 2;
        this.ball.dx = -this.ball.dx;
    }

    updateScoreDisplay() {
        const player1ScoreElement = this.querySelector('#player1Score');
        const player2ScoreElement = this.querySelector('#player2Score');
        
        if (player1ScoreElement && player2ScoreElement) {
            player1ScoreElement.textContent = `${this.player1Name}: ${this.score1}`;
            player2ScoreElement.textContent = `${this.player2Name}: ${this.score2}`;
        }
    }

    draw() {
        // Clear the canvas
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw center line
        this.ctx.strokeStyle = 'white';
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, 0);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
        this.ctx.stroke();

        // Draw paddles
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(this.paddle1.x, this.paddle1.y, this.paddle1.width, this.paddle1.height);
        this.ctx.fillRect(this.paddle2.x, this.paddle2.y, this.paddle2.width, this.paddle2.height);

        // Draw ball
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        this.ctx.fill();
    }

    gameLoop() {
        if (!this.gameStarted) return;
        
        this.update();
        this.draw();
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    showWinnerPopup() {
        this.gameStarted = false;
        const winner = this.score1 >= 3 ? this.player1Name : this.player2Name;
        
        if (this.tournamentMode) {
            // Dispatch event for tournament
            window.dispatchEvent(new CustomEvent('pongGameEnd', { detail: winner }));
            // Return to tournament view
            window.location.hash = '#tournament';
        } else {
            this.innerHTML = `
                <div class="login-container">
                    <h2 class="login-title">Game Over</h2>
                    <p class="word">${winner} wins!</p>
                    <button class="btn" id="restartGame">Play Again</button>
                    <button class="btn" id="returnToDashboard">Return to Dashboard</button>
                </div>
            `;
            this.querySelector('#restartGame').addEventListener('click', this.restartGame.bind(this));
            this.querySelector('#returnToDashboard').addEventListener('click', this.returnToDashboard.bind(this));
        }
    }

    restartGame() {
        // Reset scores
        this.score1 = 0;
        this.score2 = 0;
    
        // Reset the ball to its initial position
        this.resetBall();
    
        // Clear the game over screen and restart the game directly
        this.startGame();
    }
    

    returnToDashboard() {
        // Clean up localStorage
        localStorage.removeItem('pongPlayer1Name');
        localStorage.removeItem('pongPlayer2Name');
        localStorage.removeItem('pongTournamentMode');

        // Remove the refresh warning
        window.onbeforeunload = null;

        // Navigate to dashboard
        window.location.hash = '#dashboard';
    }

}

customElements.define('pong-game', PongGame);