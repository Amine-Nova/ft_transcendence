import { CheckAuthenticated } from "./func.js";
class dashboard extends HTMLElement
{
    async connectedCallback()
    {
<<<<<<< HEAD
        const getCookieValue = (name) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
        };
        const username = getCookieValue('username') || 'Guest';

        const res = await fetch("https://0.0.0.0:8000/get2fa/",
        {
            method :"POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username
            })
        })
        const fda = await res.json();
        let fa = false;
        if (fda.fact === "t")
            fa = true;
        console.log("2fa = ", fa, fda.fact);
        
        this.innerHTML = `
        <button class="login-btn" id="2fa" data-i18n="${fa ? '2faEnabled' : '2faDisabled'}">${fa ? '2FA enabled' : '2FA disabled'}</button>
        <label for="pet-select" data-i18n="Choose your Preferable Language:"></label>
        <select>
            <option value="" data-i18n="--Please choose an option--"></option>
            <option id="English" data-i18n="English"></option>
            <option id="Arabic" data-i18n="Arabic"></option>
            <option id="Spanish" data-i18n="Spanish"></option>
            <option id="Japanese" data-i18n="Japanese"></option>
            <option id="Tamazight" data-i18n="Tamazight"></option>
        </select>
        <div class="header">
            <div class="content">
                <button class="btn" id="log" data-i18n="Logout"></button>
=======
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
                <button class="btn" id="log">Logout</button>
>>>>>>> 2d6c35f93f9e4eff9bc0180bb369d01ae5d2bfcd
            </div>
        </div>

        <p class="btn" id="username">${username}</p>
        <div class="main-container">
            <div class="content">
<<<<<<< HEAD
                <a href="#multiplayer" class="btn" data-i18n="Multiplayer"></a>
                <a href="#tournament" class="btn" data-i18n="Pong Tournament"></a>
                <a href="#pong" class="btn" data-i18n="Play Pong"></a>  
                <a href="#ai" class="btn" data-i18n="AI Mode"></a>
=======
                <a href="" class="btn" data-i18n="Offline"></a>
                <a href="" class="btn" data-i18n="Tournament"></a>
                <a href="#pong" class="btn" data-i18n="Play Pong"></a>
>>>>>>> 2d6c35f93f9e4eff9bc0180bb369d01ae5d2bfcd
            </div>
        </div>
        `;
        changeLanguage(localStorage.getItem('preferredLanguage') || 'en');
<<<<<<< HEAD
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
        let faButton = document.getElementById("2fa");
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

        /* ####################################################### */

        faButton.addEventListener('click', async function(event) {
            event.preventDefault();
            fa = !fa

            let c = fa ? "t" : "f";
            faButton.textContent = fa ? '2FA enabled' : '2FA disabled';

            const res = await fetch("https://0.0.0.0:8000/set2fa/",
            {
                method :"PUT",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    fact: c
                })
            })
        });

        /* ####################################################### */
        
=======

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
>>>>>>> 2d6c35f93f9e4eff9bc0180bb369d01ae5d2bfcd
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
<<<<<<< HEAD
                    deleteCookie('language');
=======
>>>>>>> 2d6c35f93f9e4eff9bc0180bb369d01ae5d2bfcd
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
    clearTournamentData() {
        localStorage.removeItem('pongTournamentState');
        localStorage.removeItem('pongTournamentMode');
        localStorage.removeItem('pongPlayer1Name');
        localStorage.removeItem('pongPlayer2Name'   );
    }
}
customElements.define('dashboard-component', dashboard);