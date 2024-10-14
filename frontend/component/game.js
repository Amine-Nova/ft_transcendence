class game extends HTMLElement{
    connectedCallback(){
        this.innerHTML = `
            h1>Game</h1>
        `
    }

}
customElements.define('game-component', game);