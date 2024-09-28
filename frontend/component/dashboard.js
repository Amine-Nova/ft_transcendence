class dashboard extends HTMLElement{
    connectedCallback(){
        this.innerHTML = `
        <div class="header">
            <span class="username">Username</span>
        </div>
        <div class="main-container">
            <div class="content">
            <a href="" class="btn">Offline</a>
            <a href="" class="btn">Tournament</a>
            </div>
        </div>
        `
    }

}
customElements.define('dashboard-component', dashboard);