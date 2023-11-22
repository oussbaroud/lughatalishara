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
            if(data.status == "error"){
                error.style.display = "block";
                error.innerText = data.error;
            }else{
                success.style.display = "block";
                success.innerText = data.success; 
            }
        });
})