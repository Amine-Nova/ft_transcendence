class PongGame extends HTMLElement {
    constructor() {
        super();
        this.canvas = null;
        this.ctx = null;
        this.ball = { x: 500, y: 250, radius: 10, dx: 8, dy: 8 };  // Increased from 5 to 8
        this.paddle1 = { x: 10, y: 200, width: 10, height: 120 };  
        this.paddle2 = { x: 980, y: 200, width: 10, height: 120 };  
        this.keys = {};
        this.paddleSpeed = 9;  // Slightly increased from 7 to 9 to match faster ball
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
            this.setupBackButtonHandling();
            this.startGame();
        } else {
            this.showRegistrationPopup();
        }
    }

    setupBackButtonHandling() {
        history.pushState(null, '', location.href);
        window.onpopstate = () => {
            history.pushState(null, '', location.href);
            this.returnToDashboard();
        };
    }

    showRegistrationPopup() {
        this.innerHTML = `
            <div class="login-container">
                <h2>Player Registration</h2>
                <div class="form-group">
                <input type="text" id="player1Name" placeholder="Player 1 Name">
                <input type="text" id="player2Name" placeholder="Player 2 Name">
                </div>
                <button class="btn" id="registerPlayers">Register</button>
            </div>
        `;
        this.querySelector('#registerPlayers').addEventListener('click', this.registerPlayers.bind(this));
    }

    registerPlayers() {
        const player1Input = this.querySelector('#player1Name');
        const player2Input = this.querySelector('#player2Name');
        
        const player1Name = player1Input.value.trim();
        const player2Name = player2Input.value.trim();
        
        // Check if either name is empty
        if (player1Name === '' || player2Name === '') {
            alert('Both players must enter a name.');
            return;
        }
    
        // Check if the names are the same
        if (player1Name === player2Name) {
            alert('Player names must be different.');
            return;
        }
    
        // If names are valid and different, proceed
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
                <h2 class="signup-title">Matchmaking</h2>
                <p class="word">Player 1: ${this.player1Name}</p>
                <p class="word">Player 2: ${this.player2Name}</p>
                <button class="btn" id="startGame">Start Game</button>
            </div>
            </div>
        `;
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
        if (this.tournamentMode) {
            this.setupBackButtonHandling();
        }
    }

    handleKeyDown(e) {
        this.keys[e.key] = true;
    }

    handleKeyUp(e) {
        this.keys[e.key] = false;
    }

    update() {
        // Move paddles
        if (this.keys['w'] && this.paddle1.y > 0) this.paddle1.y -= this.paddleSpeed;
        if (this.keys['s'] && this.paddle1.y < this.canvas.height - this.paddle1.height) this.paddle1.y += this.paddleSpeed;
        if (this.keys['ArrowUp'] && this.paddle2.y > 0) this.paddle2.y -= this.paddleSpeed;
        if (this.keys['ArrowDown'] && this.paddle2.y < this.canvas.height - this.paddle2.height) this.paddle2.y += this.paddleSpeed;

        // Move ball
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;

        // Ball collision with top and bottom walls
        if (this.ball.y - this.ball.radius < 0) {
            this.ball.y = this.ball.radius; // Prevent sticking to top
            this.ball.dy *= -1;
        } else if (this.ball.y + this.ball.radius > this.canvas.height) {
            this.ball.y = this.canvas.height - this.ball.radius; // Prevent sticking to bottom
            this.ball.dy *= -1;
        }

        // Check paddle collisions
        if (this.checkPaddleCollision(this.ball, this.paddle1)) {
            this.ball.x = this.paddle1.x + this.paddle1.width + this.ball.radius; // Prevent sticking
            this.handlePaddleCollision(this.ball, this.paddle1);
        } else if (this.checkPaddleCollision(this.ball, this.paddle2)) {
            this.ball.x = this.paddle2.x - this.ball.radius; // Prevent sticking
            this.handlePaddleCollision(this.ball, this.paddle2);
        }

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

    checkPaddleCollision(ball, paddle) {
        // Find the closest point to the ball within the paddle
        let closestX = Math.max(paddle.x, Math.min(ball.x, paddle.x + paddle.width));
        let closestY = Math.max(paddle.y, Math.min(ball.y, paddle.y + paddle.height));
        
        // Calculate the distance between the closest points and the ball's center
        let distanceX = ball.x - closestX;
        let distanceY = ball.y - closestY;
        
        // Check if the distance is less than the ball's radius
        let distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);
        return distanceSquared <= (ball.radius * ball.radius);
    }

    handlePaddleCollision(ball, paddle) {
        // Calculate collision point relative to paddle center
        const paddleCenter = paddle.y + paddle.height / 2;
        const collisionPoint = ball.y - paddleCenter;
        const normalizedCollisionPoint = collisionPoint / (paddle.height / 2);
        
        // Set new velocities
        const speed = 8;  // Increased from 5 to 8
        const maxAngle = Math.PI / 4; // 45 degrees max angle
        const angle = normalizedCollisionPoint * maxAngle;
        
        // Determine direction based on which paddle was hit
        const direction = (paddle === this.paddle1) ? 1 : -1;
        
        // Update ball velocities
        ball.dx = Math.cos(angle) * speed * direction;
        ball.dy = Math.sin(angle) * speed;
    }

    resetBall() {
        this.ball.x = this.canvas.width / 2;
        this.ball.y = this.canvas.height / 2;
        
        // Reset with a random angle between -45 and 45 degrees
        const speed = 8;  // Increased from 5 to 8
        const angle = (Math.random() - 0.5) * Math.PI / 4;
        this.ball.dx = Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1);
        this.ball.dy = Math.sin(angle) * speed;
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
               // Remove the popstate event listener before dispatching the event
               window.onpopstate = null;

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
        
        localStorage.removeItem('pongPlayer1Name');
        localStorage.removeItem('pongPlayer2Name');
        localStorage.removeItem('pongTournamentMode');
        // Remove the refresh warning
          window.onbeforeunload = null;

          // Remove the popstate event listener
          window.onpopstate = null;
  
          // Navigate to dashboard
          window.location.hash = '#dashboard';
        // Clean up localStorage
        

        
    }

}

customElements.define('pong-game', PongGame);