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
            <h3><a type="submit" href="#dashboard" class="login-btn">Login</a></h3>
            <p class="sign-up"><a href="signup.html">Sign up</a></p>
            <p class="login-link">Already have an account? <a href="#signup">SignUp</a></p>
        </form>
    </div>
        `
    }

}
customElements.define('signin-component', signin);