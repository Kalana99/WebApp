let main = (page) => {
    //the page parameter should be something like 'signUp' or 'login'
    //that indicates the place where the event is called

    //get the elements
    let nonEmpty        = document.querySelectorAll('.nonEmpty.' + page);
    let normal          = document.querySelectorAll('.normal.' + page);
    let selected        = document.querySelectorAll('.selected.' + page);
    let existingPsw     = document.querySelectorAll('.existingPsw.' + page);
    let newPsw          = document.querySelectorAll('.newPsw.' + page);
    let existingEmail   = document.querySelectorAll('.existingEmail.' + page);
    let newEmail        = document.querySelectorAll('.newEmail.' + page);
    let index           = document.querySelectorAll('.index.' + page);
    let nonEmptyRadio   = document.querySelectorAll('.nonEmptyRadio.' + page);

    let correct = true;

    //validate
    correct = correct && validateExistingEmail(existingEmail);

    //submit if correct
    
    
};

//all the eventlisteners come here

//login event listener
loginSubmitButton = document.getElementById('loginSubmit');
if(loginSubmitButton)
    loginSubmitButton.addEventListener('click', event => {
        main('login');
    });

//signUp event listener
signUpSubmitButton = document.getElementById('signUpSubmit');
if(signUpSubmitButton)
    signUpSubmitButton.addEventListener('click', event => {
        main('signUp');
    });





//validation code
let validateExistingEmail = (emailInput) => {

    let email = emailInput[0];

    if (email.value === ''){
        setError(email, 'Email cannot be blank');
        return false;
    }

    data = {email: email.value};

    fetch('/checkEmailExistence', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            if(data.emailExists){
                setSuccess(email);
                // removeError(password);
                return true;
            }
            else{
                setError(email, 'Email does not exist');
                return false;
            }
        })
        .catch((error) => {
        console.error('Error:', error);
        });
};

let validateExistingPassword = (pswInput) => {
    let psw = pswInput[0];

    if (psw.value === ''){
        setError(psw, 'Password cannot be blank');
        return false;
    }

    data = {password: psw.value};

    fetch('#', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            if(data.passwordExists){
                setSuccess(psw);
                // removeError(password);
                return true;
            }
            else{
                setError(psw, 'Password does not exist');
                return false;
            }
        })
        .catch((error) => {
        console.error('Error:', error);
        });
};

// ---------------------------------------------------------------------------------------
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

// const removeError = (input) => {
//     let formControl = input.parentElement; // .form-control
//     let small = formControl.querySelector('small');

//     small.innerText = "";
//     formControl.className = 'form-control';
// }
// ---------------------------------------------------------------------------------------