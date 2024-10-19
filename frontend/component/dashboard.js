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
        <label for="pet-select">Choose your Preferable Language:</label>
        <select>
        <option value="">--Please choose an option--</option>
        <option id="English">English</option>
        <option id="Arabic">Arabic</option>
        <option id="Spanish">Spanish</option>
        <option id="Japanese">Japanese</option>
        <option id="Tamazight">Tamazight</option>
        </select>
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
        let english = document.getElementById("English");
        let arabic = document.getElementById("Arabic");
        let spanish = document.getElementById("Spanish");
        let japanese = document.getElementById("Japanese");
        let tamazight = document.getElementById("Tamazight");
        english.addEventListener('click', async function(event)
        {
            const res = await fetch("https://0.0.0.0:8000/lang/",
            {
                method :"PUT",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    language: 'en'
                })

            })
            document.cookie = `language=en; path=/; SameSite=None; Secure`;
            changeLanguage('en');
        });
        arabic.addEventListener('click', async function(event)
        {
            const res = await fetch("https://0.0.0.0:8000/lang/",
            {
                method :"PUT",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    language: 'ar'
                })
            })
            document.cookie = `language=ar; path=/; SameSite=None; Secure`;
            changeLanguage('ar');
        });
        spanish.addEventListener('click', async function(event)
        {
            const res = await fetch("https://0.0.0.0:8000/lang/",
            {
                method :"PUT",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    language: 'es'
                })
            })
            document.cookie = `language=es; path=/; SameSite=None; Secure`;
            changeLanguage('es');
        });
        japanese.addEventListener('click', async function(event)
        {
            const res = await fetch("https://0.0.0.0:8000/lang/",
            {
                method :"PUT",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    language: 'jap'
                })
            })
            document.cookie = `language=jap; path=/; SameSite=None; Secure`;
            changeLanguage('jap');
        });
        tamazight.addEventListener('click', async function(event)
        {
            const res = await fetch("https://0.0.0.0:8000/lang/",
            {
                method :"PUT",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    language: 'tmz'
                })
            })
            document.cookie = `language=tmz; path=/; SameSite=None; Secure`;
            changeLanguage('tmz');
        });
        let lang = getCookieValue('language')
        changeLanguage(lang);
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
                    deleteCookie('language');
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