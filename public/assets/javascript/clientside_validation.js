let form = document.getElementById('form');
let username = document.getElementById('username');
let index = document.getElementById('index');
let email = document.getElementById('email');
let phone = document.getElementById('phone');
let password = document.getElementById('password');
let c_password = document.getElementById('c_psw');

form.addEventListener('submit', (event) => {
    event.preventDefault();

    checkInputs();
});

function checkInputs(){
    //get the values from the inputs
    let userNameValue = username.value.trim();
    let indexValue = index.value.trim();
    let emailValue = email.value.trim();
    let phoneValue = phone.value.trim();
    let passwordValue = password.value.trim();
    let confirmPasswordValue = c_password.value.trim();

    if (userNameValue === ''){
        //show error
        //add error class
        setError(username, 'Username cannot be blank');
    }
    else{
        //add success class
        setSuccess(username);
    }
}

function setError(input, message){
    let formControl = input.parentElement; // .form-control
    let small = formControl.querySelector('small');

    //add error message inside small
    small.innerText = message;

    //add error class
    formControl.className = 'form-control error';
}