let correct = true;

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
    correct = validateExistingEmailAndPassword(existingEmail, existingPsw) && correct;
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

    //emailInput always has elements
    for (let i = 0; i < emailInput.length; i++){

        let email = emailInput[i];
        if (email.value === ''){
            setError(email, 'Email cannot be blank');
            return false;
        }

        //object will be sent only with an email if there's no password field
        data = {email: email.value};

        let password = null;
        //if there is a password field,
        if (pswInput != null){
            password = pswInput[i];
            if (password.value === ''){
                setError(password, 'Password cannot be blank');
            }
            else{
            //add password to the data object
                data.password = password.value;
            }
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
                    setSuccess(email);
                    if (data.passwordCorrect != null){
                        if (data.passwordCorrect){
                            setSuccess(password);
                            return true;
                        }
                        else{
                            setError(password, "Incorrect password");
                            return false;
                        }
                    }
                    return true;
                }
                else{
                    setError(email, 'Email does not exist');
                    if (password != null){
                        removeError(password);
                    }
                    return false;
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