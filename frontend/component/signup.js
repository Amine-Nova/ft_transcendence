class signup extends HTMLElement{
    connectedCallback(){
        this.innerHTML = `
        <div class="signup-container">
        <h1 class="signup-title">Sign Up</h1>
        <form action="#signin" class="signup-form">
            <div class="form-group">
                <label for="username" >Username</label>
                <input class="user" type="text" id="username" name="username" required>
            </div>
            <div class="form-group">
                <label for="email">Email</label>
                <input class="ayoub" type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input class="ayoub" type="password" id="password" name="password" required>
            </div>
            <div class="form-group">
                <label for="confirm-password">Confirm Password</label>
                <input class="ayoub" type="password" id="confirm-password" name="confirm-password" required>
            </div>
            <button id="submiit" type="submit" class="signup-btn">Sign Up</button>
            <p class="login-link">Already have an account? <a href="#signin">Log in</a></p>
        </form>
    </div>
        `;
        let user = document.getElementById("username");
        let pass = document.getElementById("password");
        let repass = document.getElementById("confirm-password");
        let mail = document.getElementById("email");
        let submitBuuton = document.getElementById("submiit");
        
        
        submitBuuton.addEventListener('click', async function(event){
                event.preventDefault();
            console.log(user.value);
        
            console.log(user.value);
            console.log(mail.value);
            console.log(pass.value);
            console.log(repass.value);
            const res = await fetch("http://127.0.0.1:8000/signup/", {
                    method :"POST",
                    mode:"cors",
                    headers: {
                            'Content-Type': 'application/json',
                          },
                        "method":"POST",
                        "body" : JSON.stringify({
                                username: user.value, 
                                password: pass.value,
                                email: mail.value,
                            })
                        })
                        window.location.hash = "#signin";
                    });
                }
    
}
customElements.define('signup-component', signup);
