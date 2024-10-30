import { CheckAuthenticated } from "./func.js";
import { getCookie} from "./func.js";
import { changeLanguage } from "../assets/js/script.js";
import { deleteCookie } from "./func.js";
class dashboard extends HTMLElement
{
    async connectedCallback()
    {
        const username = getCookie('username') || 'Guest';

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
           
            <div class="header">
                <div class="content">
                    <button class="ebtn" id="username">${username}</button>
                    <button class="abtn" id="2fa">${fa ? '2FA enabled' : '2FA disabled'}</button>
                    <button class="abtn" id="log" data-i18n="Logout"></button>
                </div>
            </div>
            <div class="main-container">
                <div class="dashboard">
                    <div class="select">
                        <label for="pet-select" data-i18n="Choose your Preferable Language:"></label>
                        <select>
                            <option value="" data-i18n="--Please choose an option--"></option>
                            <option id="English" data-i18n="English"></option>
                            <option id="Arabic" data-i18n="Arabic"></option>
                            <option id="Spanish" data-i18n="Spanish"></option>
                            <option id="Japanese" data-i18n="Japanese"></option>
                            <option id="Tamazight" data-i18n="Tamazight"></option>
                        </select>
                    </div>
                    <div class="elements">
                        <a href="#multiplayer" class="btn" data-i18n="Multiplayer"></a>
                        <a href="#tournament" class="btn" data-i18n="Pong Tournament"></a>
                        <a href="#pong" class="btn" data-i18n="Play Pong"></a>  
                        <a href="#ai" class="btn" data-i18n="AI Mode"></a>
                    </div>
                </div>
            </div>
        `;
        changeLanguage(localStorage.getItem('preferredLanguage') || 'en');
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
        let lang = getCookie('language')
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
    clearTournamentData() {
        localStorage.removeItem('pongTournamentState');
        localStorage.removeItem('pongTournamentMode');
        localStorage.removeItem('pongPlayer1Name');
        localStorage.removeItem('pongPlayer2Name');
    }
}
customElements.define('dashboard-component', dashboard);