import { CheckAuthenticated } from "./func.js";
class dashboard extends HTMLElement
{
    async connectedCallback()
    {
        const getCookieValue = (name) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
        };

        const username = getCookieValue('username') || 'Guest';

        this.innerHTML = `
        <header>
            <nav>
                <ul>
                    <li><a href="#dashboard" onclick="changeLanguage('en')">English</a></li>
                    <li><a href="#dashboard" onclick="changeLanguage('ar')">Arabic</a></li>
                    <li><a href="#dashboard" onclick="changeLanguage('es')">Spanish</a></li>
                    <li><a href="#dashboard" onclick="changeLanguage('jap')">Japanese</a></li>
                    <li><a href="#dashboard" onclick="changeLanguage('tmz')">Tamazight</a></li>
                </ul>
            </nav>
        </header>
        <div class="header">
        <div class="content">
            <button class="btn" id="log" data-i18n="Logout"></button>
            </div>
            </div>
            
        <p class="btn" id="username">${username}</p>
        <div class="main-container">
            <div class="content">
            <a href="#multiplayer" class="btn" data-i18n="Multiplayer"></a>
            <a href="#tournament" class="btn" data-i18n="Pong Tournament"></a>
            <a href="#pong" class="btn" data-i18n="Play Pong"></a>  
            </div>
        </div>
        `;
        changeLanguage(localStorage.getItem('preferredLanguage') || 'en');
        function deleteCookie(name) {
            document.cookie = `${name}=; expires=Thu, 20 Sep 2001 00:00:00 UTC; path=/;`;
        }
        await CheckAuthenticated();
        let submitBuuton = document.getElementById("log");
        submitBuuton.addEventListener('click', async function(event)
        {
            event.preventDefault();
            const res = await fetch("https://0.0.0.0:8000/logout/", 
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