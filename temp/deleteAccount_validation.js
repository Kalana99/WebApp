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

    
};