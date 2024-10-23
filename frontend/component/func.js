function getCookie(name) 
{
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}
function deleteCookie(name) 
{
    document.cookie = `${name}=; expires=Thu, 20 Sep 2001 00:00:00 UTC; path=/;`;
}

let access = getCookie('access');

export async function CheckAuthenticated()
{
    console.log('Checking authentication...');
    const res = await fetch('https://0.0.0.0:8000/check/',
    {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${access}`,
            'Content-Type': 'application/json',
        }
    });
    if (res.status === 401)
    {
        const res = await fetch('https://0.0.0.0:8000/token-refresh/', {
            method :"POST",
            mode:"cors",
            headers:
            {
                'Content-Type': 'application/json',
            },
            "body" : JSON.stringify
            ({
                refresh: getCookie('refresh'),
            })
        });
        if (res.status === 401)
        {
            console.error('Failed to refresh token. Logging out...');
            deleteCookie('access');
            deleteCookie('refresh');
            deleteCookie('username');
            return false;
        }
        else if (res.status === 200)
        {
            const data = await res.json();
            document.cookie = `access=${data.access}; path=/; SameSite=None; Secure`;
            return true;
        }
        else
        {
            console.log('Not Authenticated');
            return false;
        }
    }
    else
    {
        console.log('Authenticated');
        return true;
    }
}