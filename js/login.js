document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const rememberMeCheckbox = document.getElementById('customCheck');

    form.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent default form submission

        // Create an object mimicking req.body structure
        const formData = {
            email: document.getElementById('exampleInputEmail').value,
            password: document.getElementById('exampleInputPassword').value,
        };

        try {
            // Send POST request to login endpoint
            const response = await fetch('http://localhost:3002/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const responseData = await response.json();
                const accessToken = responseData.data.accessToken;
                console.log(responseData)
                console.log('Login successful');
                console.log('Access Token:', accessToken);
                
                // Set the access_token on a cookie
                document.cookie = `access_token=${accessToken}; path=/; max-age=3600`; // Cookie expires in 1 hour
                
                // Redirect to the dashboard page
                window.location.href = 'indexx.html';
            } else {
                // Handle login error
                console.error('Login failed');
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    });

    rememberMeCheckbox.addEventListener('change', (event) => {
        if (event.target.checked) {
            console.log('Remember Me checked');
        } else {
            console.log('Remember Me unchecked');
        }
    });
});