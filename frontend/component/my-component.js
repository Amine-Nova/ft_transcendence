import route from "./route.js";

console.log(route)
function navigate(){

    const path = window.location.hash.substring(1);
    const page = route[path];
    const container = document.getElementById('container');
    if (container.innerHTML !== `<${page}></${page}>`)
    {
        container.innerHTML = `<${page}></${page}>`;
    }
}

window.addEventListener("hashchange", navigate);
window.addEventListener("DOMContentLoaded", navigate);