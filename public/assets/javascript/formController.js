let correct = true;

let main = (page) => {

    correct = true;
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

    //validate
    validateExistingEmailAndPassword(existingEmail, existingPsw);
    console.log(correct);
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
let validateExistingEmailAndPassword = (emailInput, pswInput) => {

    let emailState;
    let passwordState;

    //emailInput always has elements
    for (let i = 0; i < emailInput.length; i++){

        let email = emailInput[i];
        if (email.value === ''){
            emailState = "blank";
        }

        //object will be sent only with an email if there's no password field
        data = {email: email.value};

        let password = null;
        //if there is a password field,
        if (pswInput != null){
            password = pswInput[i];
            if (password.value === ''){
                passwordState = "blank";
            }
            
            //add password to the data object
            data.password = password.value;
            
        }
    
        fetch('/checkEmailAndPassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(data => {
                //
                if(data.emailExists){
                    emailState = "success";
                    if (data.passwordCorrect != null){
                        if (data.passwordCorrect){
                            passwordState = "success";
                        }
                        else{
                            if (password.value != ''){
                                passwordState = "error";
                            }
                        }
                    }
                }
                else{
                    emailState = "error";
                }

                if (emailState === "blank"){
                    setError(email, "Email cannot be blank");
                }
                else if (emailState === "success"){
                    setSuccess(email);
                }
                else if (emailState === "error"){
                    setError(email, "Email does not exist");
                    passwordState = null;
                }

                if (passwordState === "blank"){
                    setError(password, "Password cannot be blank");
                }
                else if (passwordState === "success"){
                    setSuccess(password);
                }
                else if (passwordState === "error"){
                    setError(password, "Incorrect password");
                }
                else{
                    removeError(password);
                }

            })
            .catch((error) => {
            console.error('Error:', error);
            });
    }

    
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

const removeError = (input) => {
    let formControl = input.parentElement; // .form-control
    let small = formControl.querySelector('small');

    small.innerText = "";
    formControl.className = 'form-control';
}
// ---------------------------------------------------------------------------------------