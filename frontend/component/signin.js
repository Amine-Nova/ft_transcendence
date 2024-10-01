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
            <h3><a type="submit" class="login-btn" id="log">Login</a></h3>
            <p>
            <p class="login-link">Already have an account? <a href="#signup">SignUp</a></p>
            </p>
        </form>
    </div>
        `;
        let user = document.getElementById("username");
        let pass = document.getElementById("password");
        let submitBuuton = document.getElementById("log");
        
        
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
            }).then(res => 
                {
                if (res.ok) 
                {
                    return res.json();
                } 
                else 
                {
                    return res.json().then(data => 
                    {
                        alert(data.detail);
                    });
                }
            }).then(data => {
                localStorage.setItem('username', user.value);
                window.location.hash = "#dashboard";
            })
            .catch(error => {
                console.error(error); // Log error
                // Optionally show error message to the user
            });
        });
    }

}
customElements.define('signin-component', signin);