let form = document.getElementById('form');

form.addEventListener('submit', (event) => {
    event.preventDefault();

    serverSideValidateSubmit();
});

let serverSideValidateSubmit = function(){
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    data = {email: email, password: password};

    fetch('/loginvalidate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            if(data.fault === 'email'){
                alert('Your email is not in database');
            }
            else if(data.fault === 'password'){
                alert('Your password is incorrect');
            }
            else{
                window.location.href = ('/userprofile/' + email);
            }
        })
        .catch((error) => {
        console.error('Error:', error);
        });
};