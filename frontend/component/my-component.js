import route from "./route.js";


console.log(route)

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

function isAuthenticated() {
    const token = getCookie('access');
    return token !== null;
}

function navigate(){

    const path = window.location.hash.substring(1);
    const page = route[path];
    const container = document.getElementById('container');
    if (isAuthenticated()) {
        container.innerHTML = `<${page}></${page}>`;
    }
    else if (page !== "signup-component" && page !== "signin-component") {
        window.location.hash = '#signin';
        alert('You must be logged in to access this page.');
    }
    else 
        container.innerHTML = `<${page}></${page}>`;
    if (isAuthenticated() && (page === "signup-component" || page === "signin-component"))
        window.location.hash = "#dashboard";
}


window.addEventListener("hashchange", navigate);
window.addEventListener("DOMContentLoaded", navigate);