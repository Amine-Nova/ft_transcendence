class signin extends HTMLElement{
    connectedCallback(){
        this.innerHTML = `
        <header>
            <nav>
                <ul>
                    <li><a href="#signin" onclick="changeLanguage('en')">English</a></li>
                    <li><a href="#signin" onclick="changeLanguage('ar')">Arabic</a></li>
                    <li><a href="#signin" onclick="changeLanguage('es')">Spanish</a></li>
                    <li><a href="#signin" onclick="changeLanguage('jap')">Japanese</a></li>
                    <li><a href="#signin" onclick="changeLanguage('tmz')">Tamazight</a></li>
                </ul>
            </nav>
        </header>
        <div class="login-container">
            <h1 class="login-title" data-i18n="Login"></h1>
            <form action="#" method="POST" class="login-form">
                <div class="form-group">
                    <label for="username" data-i18n="Username"></label>
                    <input type="text" id="username" name="username" required>
                </div>
                <div class="form-group">
                    <label for="password" data-i18n="Password"></label>
                    <input type="password" id="password" name="password" required>
                </div>
                <div class="form-group">
                    <h3><a type="submit" class="login-btn" id="log" data-i18n="Login"></a></h3>
                </div>
                <div class="form-group">
                    <h3><a type="submit" class="login-btn" id="intra" data-i18n="intra login"></a></h3>
                </div>
                <p style="margin-top: 4em;">
                    <span class="login-link" data-i18n="Create an account"></span>
                    <a href="#signup" style="color:#4CAF50;" data-i18n="SignUp"></a>
                </p>
            </form>
        </div>
        `;
        changeLanguage(localStorage.getItem('preferredLanguage') || 'en');

        let user = document.getElementById("username");
        let pass = document.getElementById("password");
        let submitBuuton = document.getElementById("log");
        let intraButton = document.getElementById("intra");
        
        
        submitBuuton.addEventListener('click', async function(event)
        {
            console.log(user.value);
            event.preventDefault();
            if (user.value == "" || pass.value == "")
            {
                alert("please fill all fields");
                return;
            }
            const res = await fetch("http://127.0.0.1:8000/login/", 
            {
                    method :"POST",
                    mode:"cors",
                    headers:
                    {
                        'Content-Type': 'application/json',
                    },
                        "method":"POST",
                        "body" : JSON.stringify
                        ({
                                username: user.value, 
                                password: pass.value,
                        })
            });
            if (res.ok) 
            {
                const data = await res.json();
                document.cookie = `refresh=${data.refresh}; path=/`;
                document.cookie = `access=${data.access}; path=/`;
                window.location.hash = "#dashboard";
            } 
            else 
            {

            }
        })
        intraButton.addEventListener('click', async function(event) {
            event.preventDefault();
        
            window.location.href = "http://127.0.0.1:8000/login42/";
        });
        

}
}
customElements.define('signin-component', signin);