class dashboard extends HTMLElement
{
    connectedCallback()
    {
        const username = localStorage.getItem('username');
        this.innerHTML = `
        <div class="header">
            <button class="username" id="log">${username ? username : 'Guest'}</button>
        </div>
        
        <div class="main-container">
            <div class="content">
            <a href="" class="btn">Offline</a>
            <a href="" class="btn">Tournament</a>
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
        localStorage.setItem('username', usernameValue);


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