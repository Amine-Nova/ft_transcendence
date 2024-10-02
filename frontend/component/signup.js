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
                const res = await fetch("http://127.0.0.1:8000/signup/", {
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
