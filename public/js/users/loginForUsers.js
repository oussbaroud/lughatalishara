// Login Form Event Listener
form.addEventListener('submit', () => {
    fetch('/auth/login', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            email: email.value,
            password: password.value
        })
        })
        .then(response => response.json())
        .then(data => {
            // If LoggedIn Successfully
            if (data.success) {
                location.reload();
            
            // If Having LogIn Error
            } else {
                error.style.display = "block";
                error.innerText = data.error;
            }
        });
})