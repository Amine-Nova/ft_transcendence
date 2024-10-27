class home extends HTMLElement{
<<<<<<< HEAD
  connectedCallback(){
      this.innerHTML = `
=======
    connectedCallback(){
        this.innerHTML = `
        <header>
          <nav>
            <ul>
              <li><a href="index.html" onclick="changeLanguage('en')">English</a></li>
              <li><a href="index.html" onclick="changeLanguage('ar')">Arabic</a></li>
              <li><a href="index.html" onclick="changeLanguage('es')">Spanish</a></li>
              <li><a href="index.html" onclick="changeLanguage('jap')">Japanese</a></li>
              <li><a href="index.html" onclick="changeLanguage('tmz')">Tamazight</a></li>
            </ul>
          </nav>
        </header>
>>>>>>> 2d6c35f93f9e4eff9bc0180bb369d01ae5d2bfcd
        <div class="welcome-container">
          <h1 data-i18n="Welcome!"></h1>
          <h3><a href="#signin" class="btn" data-i18n="Get Started"></a></h3>
        </div>
<<<<<<< HEAD
      `;
      changeLanguage(localStorage.getItem('preferredLanguage') || 'en');
  }
=======
        `;
        changeLanguage(localStorage.getItem('preferredLanguage') || 'en');
    }
>>>>>>> 2d6c35f93f9e4eff9bc0180bb369d01ae5d2bfcd

}
customElements.define('home-component', home);