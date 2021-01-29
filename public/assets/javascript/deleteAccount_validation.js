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

const removeError = (input) => {
    let formControl = input.parentElement; // .form-control
    let small = formControl.querySelector('small');

    small.innerText = "";
    formControl.className = 'form-control';
}

form.addEventListener('submit', (event) => {
    event.preventDefault();

    serverSideValidateSubmit();
});

let serverSideValidateSubmit = function(){
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    let yes = document.getElementById('yes');
    let no = document.getElementById('no');
    let confirmation_yes = yes.checked;
    let confirmation_no = no.checked;
    let confirm;

    if (confirmation_yes){
        confirm = true;
    }
    else{
        confirm = false;
    }
    data = {email: email.value, password: password.value, confirmation: confirm};

    fetch('/deleteAccount', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            if(data.fault === 'email'){
                setError(email, 'Email does not exist');
                removeError(password);
            }
            else if(data.fault === 'password'){
                setSuccess(email);
                setError(password, 'password mismatch');
            }
            else{
                window.location.href = ('/login');
            }
        })
        .catch((error) => {
        console.error('Error:', error);
        });
};