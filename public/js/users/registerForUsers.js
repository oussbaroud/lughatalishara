// Register Form Event Listener
form.addEventListener('submit', () => {
    fetch('/auth/register', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            name: fullname.value,
            email: email.value,
            password: password.value
        })
    })
    .then(response => response.json())
    .then(data => {
        // If Registered Successfully
        if (data.success) {
            error.style.display = "none";
            success.style.display = "block";
            success.innerText = data.success;
        
        // If Having LoggedIn Error
        } else {
            success.style.display = "none";
            error.style.display = "block";
            error.innerText = data.error;
        }
    });
})