let form = document.getElementById('form');

const setError = (input, message) => {
    let formControl = input.parentElement; // .form-control
    let small = formControl.querySelector('small');

    //add error message inside small
    small.innerText = message;

    //add error class
    formControl.className = 'form-control error';
}

const setSuccess = (input) => {
    let formControl = input.parentElement; // .form-control

    //add success class
    formControl.className = 'form-control success';
}

form.addEventListener('submit', (event) => {
    event.preventDefault();

    serverSideValidateSubmit();
});

let serverSideValidateSubmit = function(){
    let email = document.getElementById('email');
    let password = document.getElementById('password');

    data = {email: email.value, password: password.value};

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
                setError(email, 'Email does not exist');
            }
            else if(data.fault === 'password'){
                setSuccess(email);
                setError(password, 'password mismatch');
            }
            else if(data.fault === 'verify'){
                setSuccess(password);
            }
            else{
                window.location.href = ('/userprofile/' + email.value);
            }
        })
        .catch((error) => {
        console.error('Error:', error);
        });
};