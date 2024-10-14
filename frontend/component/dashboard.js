class dashboard extends HTMLElement
{
    connectedCallback()
    {
        this.innerHTML = `
        <div class="header">
        <div class="content">
            <button class="btn" id="log">Logout</button>
        </div>
        </div>

        
        <div class="main-container">
            <div class="content">
            <a href="#game" class="btn">Offline</a>
            <a href="" class="btn">Tournament</a>
            <a href="#pong" class="btn">Play Pong</a>  
            </div>
        </div>
        `;

        const cookies = document.cookie.split('; ');
        let usernameValue = null;
        for (const cookie of cookies) {
            const [key, val] = cookie.split('=');
            if (key === 'username') {
                usernameValue = val;
                break;
            }
        }
        function deleteCookie(name) {
            document.cookie = `${name}=; expires=Thu, 20 Sep 2001 00:00:00 UTC; path=/;`;
          }
          
        let submitBuuton = document.getElementById("log");
        submitBuuton.addEventListener('click', async function(event)
        {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
                event.preventDefault();
            const res = await fetch("http://127.0.0.1:8000/logout/", 
            {
                    method :"POST",

            }).then(response => {
                if (response.ok)
                {
                    deleteCookie('access');
                    deleteCookie('refresh');
                    deleteCookie('username');
                    localStorage.clear();
                    window.location.hash = "#signin";
                } 
                else
                {
                    throw new Error("Logout failed");
                }
            })
            .catch(error => {
                console.error(error);
            })
        });
    }
}
customElements.define('dashboard-component', dashboard);