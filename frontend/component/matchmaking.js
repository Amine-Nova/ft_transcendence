class Matchmaking extends HTMLElement {
    constructor() {
        super();
        this.queue = [];
    }

    connectedCallback() {
        this.innerHTML = `
            <h2>Matchmaking</h2>
            <input type="text" id="playerName" placeholder="Enter your name">
            <button id="joinQueue">Join Queue</button>
            <div id="queueStatus"></div>
        `;

        this.querySelector('#joinQueue').addEventListener('click', this.joinQueue.bind(this));
    }

    joinQueue() {
        const playerName = this.querySelector('#playerName').value.trim();
        if (playerName === '') {
            alert('Please enter your name.');
            return;
        }

        this.queue.push(playerName);
        this.updateQueueStatus();
        this.checkForMatch();
    }

    updateQueueStatus() {
        const statusDiv = this.querySelector('#queueStatus');
        statusDiv.textContent = `Players in queue: ${this.queue.length}`;
    }

    checkForMatch() {
        if (this.queue.length >= 2) {
            const player1 = this.queue.shift();
            const player2 = this.queue.shift();
            this.startGame(player1, player2);
        }
    }

    startGame(player1, player2) {
        // Store matched players in localStorage
        localStorage.setItem('pongPlayer1Name', player1);
        localStorage.setItem('pongPlayer2Name', player2);

        // Redirect to the game page
        window.location.hash = '#pong';
    }
}

customElements.define('matchmaking-component', Matchmaking);