import route from "./route.js";
import { CheckAuthenticated } from "./func.js";

console.log(route)

function getCookie(name) 
{
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

function isAuthenticated() 
{
    const token = getCookie('access');
    return token !== null;
}

function deleteCookie(name) 
{
    document.cookie = `${name}=; expires=Thu, 20 Sep 2001 00:00:00 UTC; path=/;`;
}


async function navigate(){
    await CheckAuthenticated();
    let refresh = getCookie('refresh');
    const path = window.location.hash.substring(1);
    const page = route[path];
    const container = document.getElementById('container');
    if ((isAuthenticated()) && page !== "signup-component" && page !== "signin-component") {
        container.innerHTML = `<${page}></${page}>`;
    }
    else if ((isAuthenticated()) && (page === "signup-component" || page === "signin-component"))
        window.location.hash = "#dashboard";
    else if (page !== "signup-component" && page !== "signin-component" && page !== "home-component" && page !== "verify-component")
    {
        await CheckAuthenticated();
        refresh = getCookie('refresh');
        if (isAuthenticated() && refresh !== null)
            container.innerHTML = `<${page}></${page}>`;
        else
        {
            window.location.hash = '#signin';
            alert('You must be logged in to access this page.');
        }
    }
    else
    {
        container.innerHTML = `<${page}></${page}>`;
    }
}


window.addEventListener("hashchange", navigate);
window.addEventListener("DOMContentLoaded", navigate);




// ############################################################################################################

// async function refreshAccessToken() 
// {
//     const res = await fetch('http://0.0.0.0:8000/token-refresh/', {
//         method :"POST",
//         mode:"cors",
//         headers:
//         {
//             'Content-Type': 'application/json',
//         },
//         "body" : JSON.stringify
//         ({
//             refresh: getCookie('refresh'),
//         })
//     });
//     if (!res.ok) 
//     {
//         console.error('Failed to refresh token. Logging out...');
//         deleteCookie('access');
//         window.location.hash = "#signin";
//         return;
//     }
//     const data = await res.json();
//     if (data.access)
//     {
//         document.cookie = "access_token=" + data.access + ";path=/";
//     }
//     else 
//     {    
//         console.error('Failed to refresh token. Logging out...');
//         deleteCookie('access'); 
//         window.location.hash = "#signin";
//     }
// }

// function startTokenRefreshTimer() {
//     setTimeout(() => {
//         refreshAccessToken();
//     }, 30 * 60 * 1000);
// }