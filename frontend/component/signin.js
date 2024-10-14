class signin extends HTMLElement{
    connectedCallback(){
        this.innerHTML = `
        <div class="login-container">
        <h1 class="login-title">Login</h1>
        <form action="#" method="POST" class="login-form">
            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" required>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>
            </div>
            <div class="form-group">
            <h3><a type="submit" class="login-btn" id="log">Login</a></h3>
            </div>
            <div class="form-group">
            <h3><a type="submit" class="login-btn" id="intra">intra login</a></h3>
            </div>
            <p>
            <p class="login-link">Already have an account? <a href="#signup">SignUp</a></p>
            </p>
        </form>
    </div>
        `;
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