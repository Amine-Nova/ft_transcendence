class PongTournament extends HTMLElement {
    constructor() {
        super();
        this.players = [];
        this.brackets = [];
        this.currentRound = 0;
        this.currentMatch = null;
    }

    connectedCallback() {
        if (this.loadTournamentState()) {
            this.showCurrentState();
        } else {
            this.showParticipantCountForm();
        }
    }

    showParticipantCountForm() {
        this.innerHTML = `
        <style>
            label {
                font-size: 1.2em;
                margin-bottom: 5px;
                display: inline;
            }
        </style>

        <div class="login-container">
            <h2>Pong Tournament Setup</h2>
            <form id="participantCountForm">
                <label for="participantCount">Number of Participants:</label>
                <input type="number" id="participantCount" min="2" max="16" required>
                <button class="btn" id="registerPlayers" type="submit">Next</button>
            </form>
        </div>
    `;
        this.querySelector('#participantCountForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const count = parseInt(this.querySelector('#participantCount').value);
            this.showRegistrationForm(count);
        });
    }

    showRegistrationForm(count) {
        let inputs = '';
        for (let i = 1; i <= count; i++) {
            inputs += `<input type="text" id="player${i}" placeholder="Player ${i} Name" required><br>`;
        }
        this.innerHTML = `
        <div class="login-container">
            <h2>Player Registration</h2>
            <form id="registrationForm">
                ${inputs}
                <button class="btn" id="registerPlayers" type="submit">Start Tournament</button>
            </form>
        </div>
        `;
        this.querySelector('#registrationForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.players = Array.from({ length: count }, (_, i) => this.querySelector(`#player${i+1}`).value.trim());
            this.startTournament();
        });
    }

    startTournament() {
        localStorage.removeItem('previousWinner'); 
        this.brackets = [this.createInitialBracket(this.players)];
        this.currentRound = 0;
        this.saveTournamentState();
        this.playNextMatch();
    }

    createInitialBracket(players) {
        const shuffled = players.sort(() => 0.5 - Math.random());
        const bracket = [];
        for (let i = 0; i < shuffled.length; i += 2) {
            if (i + 1 < shuffled.length) {
                bracket.push([shuffled[i], shuffled[i + 1]]);
            } else {
                bracket.push([shuffled[i]]); // Single player advances automatically
            }
        }
        return bracket;
    }

    playNextMatch() {
        if (this.brackets[this.currentRound].every(match => match.length === 1)) {
            // All matches in this round are complete
            if (this.brackets[this.currentRound].length === 1) {
                // Tournament is over
                this.declareTournamentWinner(this.brackets[this.currentRound][0][0]);
                return;
            }
            // Prepare next round
            this.currentRound++;
            this.brackets[this.currentRound] = this.createNextRoundBracket(this.brackets[this.currentRound - 1]);
        }
      
        // Find next match to play
        this.currentMatch = this.brackets[this.currentRound].find(match => match.length === 2);
        if (this.currentMatch) {
            this.showMatchmaking(this.currentMatch[0], this.currentMatch[1]);
        } else {
            // No more matches in this round, should move to next round
            this.playNextMatch();
        }
    }
      
    createNextRoundBracket(previousRound) {
        const winners = previousRound.filter(match => match.length === 1).map(match => match[0]);
        const nextRound = [];
        for (let i = 0; i < winners.length; i += 2) {
            if (i + 1 < winners.length) {
                nextRound.push([winners[i], winners[i + 1]]);
            } else {
                nextRound.push([winners[i]]); // Odd player out
            }
        }
        return nextRound;
    }

    showMatchmaking(player1, player2) {
        // Retrieve the previous match winner from localStorage
        const previousWinner = localStorage.getItem('previousWinner');
    
        this.innerHTML = `
            <style>
            .form-group p {
                font-size: 2em;
                font-weight: bold;
                text-align: center;
                color: #ffffff;
                background: rgba(0, 0, 0, 0.5);
                padding: 10px;
                border-radius: 8px;
                margin: 10px 0;
            }
            .previous-winner {
                font-size: 1.5em;
                font-weight: bold;
                text-align: center;
                color: #ffd700; /* Golden color for the winner */
                background: rgba(50, 50, 50, 0.8); /* Darker semi-transparent background */
                padding: 10px;
                border: 2px solid #ffd700; /* Golden border */
                border-radius: 8px;
                margin-top: 15px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); /* Subtle shadow for a lifted effect */
            }
            </style>
    
            <div class="login-container">
                <h2>Next Match</h2>
                <div class="form-group">
                    <p>${player1} vs ${player2}</p>
                    ${previousWinner ? `<div class="previous-winner">Last Winner: ${previousWinner}</div>` : ''}
                </div>
                <button class="btn" id="startMatch">Start Match</button>
            </div>
        `;
        this.querySelector('#startMatch').addEventListener('click', () => this.startMatch(player1, player2));
    }
    
    

    startMatch(player1, player2) {
        // Ensure we're passing string values
        localStorage.setItem('pongPlayer1Name', String(player1));
        localStorage.setItem('pongPlayer2Name', String(player2));
        localStorage.setItem('pongTournamentMode', 'true');
        window.location.hash = '#pong';

        // Listen for the game end event
        window.addEventListener('pongGameEnd', this.onMatchEnd.bind(this), { once: true });
    }

    onMatchEnd(event) {
        const winner = event.detail;
    
        // Store the winner's name in localStorage for the next match display
        localStorage.setItem('previousWinner', winner);
    
        // Update the current bracket with the winner
        this.brackets[this.currentRound] = this.brackets[this.currentRound].map(match => 
            match.includes(this.currentMatch[0]) || match.includes(this.currentMatch[1]) ? [winner] : match
        );
        this.currentMatch = null; // Clear the current match
        this.saveTournamentState();
        this.showMatchResult(winner);
    }
    

    showMatchResult(winner) {
        this.innerHTML = `
            <h2>Match Result</h2>
            <p>${winner} wins the match!</p>
            <button id="nextMatch">Next Match</button>
        `;
        this.querySelector('#nextMatch').addEventListener('click', () => this.playNextMatch());
    }

    declareTournamentWinner(winner) {
        this.innerHTML = `
        <style>
            .login-container {
                text-align: center;
                background: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
                padding: 20px;
                border-radius: 10px;
                max-width: 400px;
                margin: 0 auto;
            }

            .login-container h2 {
                font-size: 1.8em;
                margin-bottom: 15px;
                color: #ffffff; /* White for good contrast */
            }

            .login-container .word {
                font-size: 1.4em;
                font-weight: bold;
                color: #ffffff;
                margin: 10px 0;
                background: rgba(255, 255, 255, 0.1); /* Slightly lighter background to highlight */
                padding: 10px;
                border-radius: 5px;
            }

            

            
        </style>

        <div class="login-container">
            <h2 class="login-title">Tournament Ended</h2>
            <p class="word">${winner} is the tournament champion!</p>
            <button class="btn" id="newTournament">Start New Tournament</button>
            <button class="btn" id="returnToDashboard">Return to Dashboard</button>
        </div>
    `;
        this.querySelector('#newTournament').addEventListener('click', () => {
            this.clearTournamentState();
            this.showParticipantCountForm();
        });
        this.querySelector('#returnToDashboard').addEventListener('click', () => {
            this.clearTournamentState();
            window.location.hash = '#dashboard';
        });
    }

    saveTournamentState() {
        const state = {
            players: this.players,
            brackets: this.brackets,
            currentRound: this.currentRound,
            currentMatch: this.currentMatch
        };
        localStorage.setItem('pongTournamentState', JSON.stringify(state));
    }

    loadTournamentState() {
        const savedState = localStorage.getItem('pongTournamentState');
        if (savedState) {
            const state = JSON.parse(savedState);
            Object.assign(this, state);
            return true;
        }
        return false;
    }

    clearTournamentState() {
        localStorage.removeItem('pongTournamentState');
        localStorage.removeItem('pongTournamentMode');
        localStorage.removeItem('pongPlayer1Name');
        localStorage.removeItem('pongPlayer2Name');
        localStorage.removeItem('previousWinner');  // Clear the winner data

    }

    showCurrentState() {
        if (this.currentMatch) {
            this.showMatchmaking(this.currentMatch[0], this.currentMatch[1]);
        } else {
            this.playNextMatch();
        }
    }
}

customElements.define('pong-tournament', PongTournament);