class signin extends HTMLElement{
    connectedCallback(){
        this.innerHTML = `
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
        
        const getCookieValue = (name) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
        };
        submitBuuton.addEventListener('click', async function(event)
        {
            console.log(user.value);
            event.preventDefault();
            if (user.value == "" || pass.value == "")
            {
                alert("please fill all fields");
                return;
            }
            const res = await fetch("https://0.0.0.0:8000/login/", 
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
                document.cookie = `refresh=${data.refresh}; path=/; SameSite=None; Secure`;
                document.cookie = `access=${data.access}; path=/; SameSite=None; Secure`;
                document.cookie = `username=${user.value}; path=/; SameSite=None; Secure`;
                document.cookie = `language=${data.language}; path=/; SameSite=None; Secure`;
                changeLanguage(data.language);
                window.location.hash = "#dashboard";
            } 
            else 
            {
                return res.json().then(data => 
                {
                    alert(data.detail);
                });
            }
        })
        intraButton.addEventListener('click', async function(event) {
            event.preventDefault();
        
            window.location.href = "https://0.0.0.0:8000/login42/";
        });
}
}
customElements.define('signin-component', signin);