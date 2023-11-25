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
            if(data.status == "error"){
                success.style.display = "none";
                error.style.display = "block";
                error.innerText = data.error;
            }else{
                error.style.display = "none";
                success.style.display = "block";
                success.innerText = data.success; 
            }
        });
})