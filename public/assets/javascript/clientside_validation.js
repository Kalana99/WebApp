let form = document.getElementById('form');
let name = document.getElementById('name');
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
    let nameValue = name.value.trim();
    let indexValue = index.value.trim();
    let emailValue = email.value.trim();
    let phoneValue = phone.value.trim();
    let passwordValue = password.value.trim();
    let confirmPasswordValue = c_password.value.trim();

    if (nameValue === ''){
        //show error
        //add error class
        setError(name);
    }
    else{
        //add success class
    }
}

let serverSideValidateSignup = function(data){
    
};