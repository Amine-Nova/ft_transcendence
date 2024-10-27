class signup extends HTMLElement{
    connectedCallback(){
        this.innerHTML = `
        <header>
            <nav>
                <ul>
                    <li><a href="#signup" onclick="changeLanguage('en')">English</a></li>
                    <li><a href="#signup" onclick="changeLanguage('ar')">Arabic</a></li>
                    <li><a href="#signup" onclick="changeLanguage('es')">Spanish</a></li>
                    <li><a href="#signup" onclick="changeLanguage('jap')">Japanese</a></li>
                    <li><a href="#signup" onclick="changeLanguage('tmz')">Tamazight</a></li>
                </ul>
            </nav>
        </header>
        <div class="signup-container">
            <h1 class="signup-title" data-i18n="Sign Up"></h1>
            <form action="#signin" class="signup-form">
                <div class="form-group">
                    <label for="username" data-i18n="Username"></label>
                    <input class="user" type="text" id="username" name="username" required>
                </div>
                <div class="form-group">
                    <label for="email" data-i18n="Email"></label>
                    <input class="ayoub" type="email" id="email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="password" data-i18n="Password"></label>
                    <input class="ayoub" type="password" id="password" name="password" required>
                </div>
                <div class="form-group">
                    <label for="confirm-password" data-i18n="Confirm Password"></label>
                    <input class="ayoub" type="password" id="confirm-password" name="confirm-password" required>
                </div>
                <button id="submiit" type="submit" class="signup-btn" data-i18n="Sign Up"></button>
                <p style="margin-top: 4em;">
                    <span class="login-link" data-i18n="Already have an account? "></span>
                    <a href="#signin" style="color:#4CAF50;" data-i18n="Log in"></a>
                </p>
            </form>
        </div>
        `;
        changeLanguage(localStorage.getItem('preferredLanguage') || 'en');
<<<<<<< HEAD
=======

>>>>>>> 2d6c35f93f9e4eff9bc0180bb369d01ae5d2bfcd
        let user = document.getElementById("username");
        let pass = document.getElementById("password");
        let repass = document.getElementById("confirm-password");
        let mail = document.getElementById("email");
        let submitBuuton = document.getElementById("submiit");
        
        
        submitBuuton.addEventListener('click', async function(event){
                event.preventDefault();
            if (pass.value != repass.value){
                alert("passwords do not match");
                return;
            }
            if (user.value == "" || pass.value == "" || mail.value == "")
            {
                alert("please fill all fields");
                return;
            }
            if(mail.value.indexOf("@") == -1 || mail.value.indexOf(".") == -1)
            {
                alert("please enter a valid email");
                return;
            }
            try {
                const res = await fetch("https://0.0.0.0:8000/signup/", {
                    method: "POST",
                    mode: "cors",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: user.value,
                        password: pass.value,
                        email: mail.value,
                    })
                });
                const data = await res.json();
        
                if (res.ok) {
                    window.location.hash = "#signin";
                } else {
                    alert(data.error || "An error occurred during signup.");
                }
                } catch (error) {
                    alert("Failed to sign up. Please try again.");
                }
            });
}
    
}
customElements.define('signup-component', signup);
