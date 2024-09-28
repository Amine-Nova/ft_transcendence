class home extends HTMLElement{
    connectedCallback(){
        this.innerHTML = `
        <div class="welcome-container">
        <h1>Welcome!</h1>
        
        <!-- Button to redirect to another page or dashboard -->
        <h3><a href="#signin" class="btn">Get Started</a></h3>
      </div>
        `
    }

}
customElements.define('home-component', home);