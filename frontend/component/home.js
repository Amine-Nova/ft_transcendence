class home extends HTMLElement{
  connectedCallback(){
      this.innerHTML = `
      <div class="welcome-container">
        <h1 data-i18n="Welcome!"></h1>
        <h3><a href="#signin" class="btn" data-i18n="Get Started"></a></h3>
      </div>
      `;
      changeLanguage(localStorage.getItem('preferredLanguage') || 'en');
  }

}
customElements.define('home-component', home);