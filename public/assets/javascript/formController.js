let correct = true;

let main = async (page) => {

    correct = true;
    //the page parameter should be something like 'signUp' or 'login'
    //that indicates the place where the event is called

    //get the elements
    let nonEmpty        = document.querySelectorAll('.nonEmpty.' + page);
    let normal          = document.querySelectorAll('.normal.' + page);
    let selected        = document.querySelectorAll('.selected.' + page);
    let existingPsw     = document.querySelectorAll('.existingPsw.' + page);    //done
    let newPsw          = document.querySelectorAll('.newPsw.' + page);
    let existingEmail   = document.querySelectorAll('.existingEmail.' + page);  //done
    let newEmail        = document.querySelectorAll('.newEmail.' + page);       //done
    let index           = document.querySelectorAll('.index.' + page);
    let nonEmptyRadio   = document.querySelectorAll('.nonEmptyRadio.' + page);

    //validate
    await validateExistingEmailAndPassword(existingEmail, existingPsw);
    //submit if correct
    
    if(correct){
        await finalize(page, nonEmpty, normal, selected, existingPsw, newPsw, existingEmail, newEmail, index, nonEmptyRadio);
        console.log('here');
    };
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

//login validation front and back
let validateExistingEmailAndPassword = async (emailInput, pswInput) => {

    let emailState;
    let passwordState;

    //emailInput always has elements
    for (let i = 0; i < emailInput.length; i++){

        let email = emailInput[i].value.trim();

        if (email === ''){
            emailState = "blank";
        }

        //object will be sent only with an email if there's no password field
        let requestData = {email: email};

        let password = null;
        //if there is a password field,
        if (pswInput != null){
            password = pswInput[i].value.trim();
            if (password === ''){
                passwordState = "blank";
            }
            
            //add password to the data object
            requestData.password = password;
            
        }

        let response = await fetch('/checkEmailAndPassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
            });

        let data = await response.json();
        
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
            correct = false;
        }
        else if (emailState === "success"){
            if (data.verified){
                setSuccess(email);
            }
            else{
                setError(email, "Please verify the email");
                correct = false;
            }
            
        }
        else if (emailState === "error"){
            setError(email, "Email does not exist");
            passwordState = null;
            correct = false;
        }

        if (passwordState === "blank"){
            setError(password, "Password cannot be blank");
            correct = false;
        }
        else if (passwordState === "success"){
            setSuccess(password);
        }
        else if (passwordState === "error"){
            setError(password, "Incorrect password");
            correct = false;
        }
        else{
            removeError(password);
            correct = false;
        }

    }

    
};

//signup validation front and back
let validateNewEmail = async (emailInput) => {
    //state --> 'blank', 'success', 'error', notAnEmail'.
    let emailState;

    for (let i=0; i<emailInput.length; i++){
        let email = emailInput[i].value.trim();

        if (email === ''){
            emailState = "blank";
        }
        else if (!isEmail(email)){
            emailState = 'notAnEmail'
        }
        else{
            let requestData = {email: email};

            let response = await fetch('/checkEmailExistence', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            let data = await response.json();

            if (data.emailExists){
                emailState = 'error';   //email must be a new unused one
            }
            else{
                emailState = 'success';
            }

            //calling setError and setSuccess according to email state
            if (emailState === 'blank'){
                setError(email, 'Email cannot be blank');
                correct = false;
            }
            else if (emailState === 'notAnEmail'){
                setError(email, 'Surprise MOTHERFUCKER'); //change this later
            }
            else if (emailState === 'error'){
                setError(email, 'Email already exists');
            }
            else if (emailState === 'success'){
                setSuccess(email);
            }
        }
    }

    let isEmail = (email) => {
        //RegExr email validation
        //no need to understand
        //reference - https://codepen.io/FlorinPop17/pen/OJJKQeK
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
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

const finalize = async (page, nonEmpty, normal, selected, existingPsw, newPsw, existingEmail, newEmail, index, nonEmptyRadio) => {
    if(page === 'login'){
        console.log('starting login');
        email = existingEmail[0].value;

        let response = await fetch('/login', {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email}),
        });
        console.log('awaited fetch');
        let data = await response.json();
        console.log('fetch worked');
        window.location.href = '/userProfile';
    }

};