class PongGame extends HTMLElement {
    constructor() {
        super();
        this.canvas = null;
        this.ctx = null;
<<<<<<< HEAD
        this.ball = { x: 500, y: 250, radius: 10, dx: 8, dy: 8 };  // Increased from 5 to 8
        this.paddle1 = { x: 10, y: 200, width: 10, height: 120 };  
        this.paddle2 = { x: 980, y: 200, width: 10, height: 120 };  
        this.keys = {};
        this.paddleSpeed = 9;  // Slightly increased from 7 to 9 to match faster ball
=======
        this.ball = { x: 400, y: 200, radius: 10, dx: 5, dy: 5 };
        this.paddle1 = { x: 10, y: 150, width: 10, height: 100 };
        this.paddle2 = { x: 780, y: 150, width: 10, height: 100 };
        this.keys = {};
>>>>>>> 2d6c35f93f9e4eff9bc0180bb369d01ae5d2bfcd
        this.score1 = 0;
        this.score2 = 0;
        this.player1Name = '';
        this.player2Name = '';
        this.gameStarted = false;
<<<<<<< HEAD
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
                <h2 data-i18n="Player Registration"></h2>
                <div class="form-group">
                    <label data-i18n="First Player Name"></label>
                    <input type="text" id="player1Name">
                    <label data-i18n="Second Player Name"></label>
=======
    }

    connectedCallback() {
        this.showRegistrationPopup();
    }
    // <label for="password" data-i18n="Password"></label>
    // <input type="password" id="password" name="password" required>
    showRegistrationPopup() {
        this.innerHTML = `
            <header>
                <nav>
                    <ul>
                        <li><a href="#pong" onclick="changeLanguage('en')">English</a></li>
                        <li><a href="#pong" onclick="changeLanguage('ar')">Arabic</a></li>
                        <li><a href="#pong" onclick="changeLanguage('es')">Spanish</a></li>
                        <li><a href="#pong" onclick="changeLanguage('jap')">Japanese</a></li>
                        <li><a href="#pong" onclick="changeLanguage('tmz')">Tamazight</a></li>
                    </ul>
                </nav>
            </header>
            <div class="login-container">
                <h2 data-i18n="Player Registration"></h2>
                <div class="form-group">
                    <label data-i18n="First Player Name"></label> 
                    <input type="text" id="player1Name">
                    <label data-i18n="Second Player Name"></label> 
>>>>>>> 2d6c35f93f9e4eff9bc0180bb369d01ae5d2bfcd
                    <input type="text" id="player2Name">
                </div>
                <button class="btn" id="registerPlayers" data-i18n="Register"></button>
            </div>
        `;
<<<<<<< HEAD
=======
        changeLanguage(localStorage.getItem('preferredLanguage') || 'en');
>>>>>>> 2d6c35f93f9e4eff9bc0180bb369d01ae5d2bfcd
        this.querySelector('#registerPlayers').addEventListener('click', this.registerPlayers.bind(this));
    }

    registerPlayers() {
        const player1Input = this.querySelector('#player1Name');
        const player2Input = this.querySelector('#player2Name');
        
<<<<<<< HEAD
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
                    <h2 class="signup-title" data-i18n="Matchmaking"></h2>
                    <div class="word">
                        <span data-i18n="Player 1: "></span>
                        <span> ${this.player1Name} </span>
                    </div>
                    <div class="word">
                        <span data-i18n="Player 2: "></span>
                        <span> ${this.player2Name} </span>
                    </div>
                    <button class="btn" id="startGame" data-i18n="Start Game"></button>
                </div>
            </div>
        `;
        this.querySelector('#startGame').addEventListener('click', this.startGame.bind(this));
    }

    startGame() {        
=======
        if (player1Input.value.trim() === '' || player2Input.value.trim() === '') {
            alert('Both players must enter a name.');
            return;
        }

        this.player1Name = player1Input.value.trim();
        this.player2Name = player2Input.value.trim();
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
>>>>>>> 2d6c35f93f9e4eff9bc0180bb369d01ae5d2bfcd
        this.innerHTML = `
            <div id="gameArea">
                <div class="score-container" id="scoreBoard">
                    <span class="score" id="player1Score">${this.player1Name}: 0</span> -
                    <span class="score" id="player2Score">${this.player2Name}: 0</span>
                </div>
<<<<<<< HEAD
                <canvas id="pongCanvas" width="1000" height="500"></canvas>
=======
                <canvas id="pongCanvas" width="800" height="400"></canvas>
>>>>>>> 2d6c35f93f9e4eff9bc0180bb369d01ae5d2bfcd
            </div>
        `;

        this.canvas = this.querySelector('#pongCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.addEventListener('keyup', this.handleKeyUp.bind(this));
        
<<<<<<< HEAD

        this.gameStarted = true;
        this.gameLoop();
        if (this.tournamentMode) {
            this.setupBackButtonHandling();
        }
=======
        this.gameStarted = true;
        this.gameLoop();
>>>>>>> 2d6c35f93f9e4eff9bc0180bb369d01ae5d2bfcd
    }

    handleKeyDown(e) {
        this.keys[e.key] = true;
    }

    handleKeyUp(e) {
        this.keys[e.key] = false;
    }

    update() {
        // Move paddles
<<<<<<< HEAD
        if (this.keys['w'] && this.paddle1.y > 0) this.paddle1.y -= this.paddleSpeed;
        if (this.keys['s'] && this.paddle1.y < this.canvas.height - this.paddle1.height) this.paddle1.y += this.paddleSpeed;
        if (this.keys['ArrowUp'] && this.paddle2.y > 0) this.paddle2.y -= this.paddleSpeed;
        if (this.keys['ArrowDown'] && this.paddle2.y < this.canvas.height - this.paddle2.height) this.paddle2.y += this.paddleSpeed;
=======
        if (this.keys['w'] && this.paddle1.y > 0) this.paddle1.y -= 5;
        if (this.keys['s'] && this.paddle1.y < this.canvas.height - this.paddle1.height) this.paddle1.y += 5;
        if (this.keys['ArrowUp'] && this.paddle2.y > 0) this.paddle2.y -= 5;
        if (this.keys['ArrowDown'] && this.paddle2.y < this.canvas.height - this.paddle2.height) this.paddle2.y += 5;
>>>>>>> 2d6c35f93f9e4eff9bc0180bb369d01ae5d2bfcd

        // Move ball
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;

<<<<<<< HEAD
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
=======
        // Ball collision with top and bottom
        if (this.ball.y - this.ball.radius < 0 || this.ball.y + this.ball.radius > this.canvas.height) {
            this.ball.dy *= -1;
        }

        // Ball collision with paddles
        if (
            (this.ball.x - this.ball.radius < this.paddle1.x + this.paddle1.width &&
             this.ball.y > this.paddle1.y && 
             this.ball.y < this.paddle1.y + this.paddle1.height) ||
            (this.ball.x + this.ball.radius > this.paddle2.x &&
             this.ball.y > this.paddle2.y && 
             this.ball.y < this.paddle2.y + this.paddle2.height)
        ) {
            this.ball.dx *= -1;
>>>>>>> 2d6c35f93f9e4eff9bc0180bb369d01ae5d2bfcd
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

<<<<<<< HEAD
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
=======
    resetBall() {
        this.ball.x = this.canvas.width / 2;
        this.ball.y = this.canvas.height / 2;
        this.ball.dx = -this.ball.dx;
    }

    updateScoreDisplay() {
        this.querySelector('#player1Score').textContent = `${this.player1Name}: ${this.score1}`;
        this.querySelector('#player2Score').textContent = `${this.player2Name}: ${this.score2}`;
    }

>>>>>>> 2d6c35f93f9e4eff9bc0180bb369d01ae5d2bfcd
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
<<<<<<< HEAD
        
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
                    <h2 class="login-title" data-i18n="Game Over"></h2>
                    <div class="word">
                        <span>${winner}</span>
                        <span data-i18n=" wins!"></span>
                    </div>
                    <button class="btn" id="restartGame" data-i18n="Play Again"></button>
                    <button class="btn" id="returnToDashboard" data-i18n="Return to Dashboard"></button>
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

=======
        this.innerHTML = `
        <div class="login-container">
            <h2 class="login-title" data-i18n="Game Over"></h2>
            <div class="player-info">
                <span class="word">${winner} </span>
                <span class="word" data-i18n="wins!"></span>
            </div>
            <button class="btn" id="restartGame" data-i18n="Play Again"></button>
            <button class="btn" id="returnToDashboard" data-i18n="Return to Dashboard"></button>
        </div>
        `;
        changeLanguage(localStorage.getItem('preferredLanguage') || 'en');

        this.querySelector('#restartGame').addEventListener('click', () => {
            this.score1 = 0;
            this.score2 = 0;
            this.showMatchmakingWindow();
        });
        this.querySelector('#returnToDashboard').addEventListener('click', () => {
            window.location.hash = '#dashboard';
        });
    }
>>>>>>> 2d6c35f93f9e4eff9bc0180bb369d01ae5d2bfcd
}

customElements.define('pong-game', PongGame);