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

    //uncomment this block check if the inputs have all been identified

    console.log(nonEmpty);
    console.log(normal);
    console.log(selected);
    console.log(existingPsw);
    console.log(newPsw);
    console.log(existingEmail);
    console.log(newEmail);
    console.log(index);
    console.log(nonEmptyRadio);

    //validate existing email
    await validateExistingEmailAndPassword(existingEmail, existingPsw);

    //validate new email
    await validateNewEmail(newEmail);

    //submit if correct
    if(correct){
        await finalize(page, nonEmpty, normal, selected, existingPsw, newPsw, existingEmail, newEmail, index, nonEmptyRadio);
    };
};

//----------------------------------------------------------------------------------------

//login validation front and back
let validateExistingEmailAndPassword = async (emailInput, pswInput) => {

    let emailState;
    let passwordState;

    //emailInput always has elements
    for (let i = 0; i < emailInput.length; i++){

        let email = emailInput[i];
        let emailValue = email.value.trim();
        let data;

        if (emailValue === ''){
            emailState = "blank";
        }
        else{

            //object will be sent only with an email if there's no password field
            let requestData = {email: emailValue};

            let password = null;
            let passwordValue;
            //if there is a password field,
            if (pswInput != null){
                password = pswInput[i];
                passwordValue = password.value.trim();
                if (passwordValue === ''){
                    passwordState = "blank";
                }
                
                //add password to the data object
                requestData.password = passwordValue;
                
            }

            let response = await fetch('/checkEmailAndPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
                });

            data = await response.json();
            
            if(data.emailExists){
                emailState = "success";
                if (data.passwordCorrect != null){
                    if (data.passwordCorrect){
                        passwordState = "success";
                    }
                    else{
                        if (passwordValue != ''){
                            passwordState = "error";
                        }
                    }
                }
            }
            else{
                emailState = "error";
            }

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
        let email = emailInput[i];
        let emailValue = email.value.trim();

        if (emailValue === ''){
            emailState = "blank";
        }
        else if (! await (isEmail(emailValue))){
            emailState = 'notAnEmail'
        }
        else{
            let requestData = {email: emailValue};

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
        }

        //calling setError and setSuccess according to email state
        if (emailState === 'blank'){
            setError(email, 'Email cannot be blank');
            correct = false;
        }
        else if (emailState === 'notAnEmail'){
            setError(email, 'Surprise MOTHERFUCKER'); //change this later
            correct = false;
        }
        else if (emailState === 'error'){
            setError(email, 'Email already exists');
            correct = false;
        }
        else if (emailState === 'success'){
            setSuccess(email);
        }
        
    }

    async function isEmail(email){
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
        email = existingEmail[0].value;

        let response = await fetch('/login', {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email}),
        });
        let data = await response.json();
        window.location.href = '/userProfile';
    }

    else if(page === 'signUp'){

        data = {};

        data['name'] = querySelectorFrom('.fullName', nonEmpty)[0].value;
        data['index'] = querySelectorFrom('.index', index)[0].value;
        data['email'] = querySelectorFrom('.newEmail', newEmail)[0].value;
        data['birthday'] = querySelectorFrom('.birthday', nonEmpty)[0].value;
        data['gender'] = querySelectorFrom('.gender', nonEmptyRadio)[0].value;
        data['phone'] = querySelectorFrom('.phone', nonEmpty)[0].value;
        data['password'] = querySelectorFrom('.psw', newPsw)[0].value;
        data['type'] = querySelectorFrom('.type', nonEmptyRadio)[0].value;
        data['faculty'] = querySelectorFrom('.faculty', normal)[0].value;
        data['verified'] = false;

        //post the data and redirect to verify page
        fetch('/signup', {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            window.location.href = '/verifyemail/' + data.id;
        })
        .catch((error) => {
        console.error('Error:', error);
        });

    }

    else if(page === 'addDrop'){

        data = {};

        data['StaffID'] = document.querySelector('.selectedFinal').getAttribute('id');
        data['type'] = 'addDrop';
        data['status'] = 'active';
        data['message'] = querySelectorFrom('.description', nonEmpty)[0].value;
        data['additionalData'] = {'requiredModule': querySelectorFrom('.requiredModule', nonEmpty)[0].value};
        data['module'] = querySelectorFrom('.currentModule', nonEmpty)[0].value;

        fetch('/submitRequest', {
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(data => {
                window.location.href = '/userProfile';
            })
            .catch((error) => {
                console.error('Error:', error);
            });

    }

    else if(page === 'repeat'){

        data = {};

        data['StaffID'] = document.querySelector('.selectedFinal').getAttribute('id');
        data['type'] = 'repeat';
        data['status'] = 'active';
        data['message'] = querySelectorFrom('.description', nonEmpty)[0].value;
        data['module'] = querySelectorFrom('.currentModule', nonEmpty)[0].value;

        fetch('/submitRequest', {
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(data => {
                window.location.href = '/userProfile';
            })
            .catch((error) => {
                console.error('Error:', error);
            });

    }

    else if(page === 'submission'){

        data = {};

        data['StaffID'] = document.querySelector('.selectedFinal').getAttribute('id');
        data['type'] = 'submission';
        data['status'] = 'active';
        data['message'] = querySelectorFrom('.description', nonEmpty)[0].value;
        data['module'] = querySelectorFrom('.currentModule', nonEmpty)[0].value;

        fetch('/submitRequest', {
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(data => {
                window.location.href = '/userProfile';
            })
            .catch((error) => {
                console.error('Error:', error);
            });

    }

    else if(page === 'thread'){

        let data = {};

        data['text'] = querySelectorFrom('.reply', nonEmpty)[0].value;
        data['threadId'] = document.querySelector('.selected').getAttribute('id');
        
        fetch('/reply', {
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                window.location.reload();
            })
            .catch((error) => {
            console.error('Error:', error);
            });

    }

    else if(page === 'changePsw'){
        data = {};

        data['new_password'] = querySelectorFrom('.psw', newPsw)[0].value;

        fetch('/changePassword', {
            method: 'PUT', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(data => {
                window.location.href = '/userProfile';
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
    
};

//function to extract certain elements from a list of elements according to selector
function querySelectorFrom(selector, elements) {
    return [].filter.call(elements, function(element) {
        return element.matches(selector);
    });
}

//----------------------------------------------------------------------------------------

//all the eventlisteners come here

let setEventListeners = () => {

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

    //add drop request event listener
    addDropSubmitButton = document.getElementById('addDropSubmitButton');
    if(addDropSubmitButton)
        addDropSubmitButton.addEventListener('click', event => {
            main('addDrop');
        });

    //repeate request event listener
    repeatSubmitButton = document.getElementById('repeatSubmitButton');
    if(repeatSubmitButton)
        repeatSubmitButton.addEventListener('click', event => {
            console.log('button clicked');
            main('repeat');
        });

    //submission request event listener
    submissionSubmitButton = document.getElementById('submissionSubmitButton');
    if(submissionSubmitButton)
        submissionSubmitButton.addEventListener('click', event => {
            main('submission');
        });

    //reply to thread event listener
    threadReplySubmitButton = document.getElementById('replySubmitButton');
    if(threadReplySubmitButton)
        threadReplySubmitButton.addEventListener('click', event => {
            main('thread');
        });

    //change password event listener
    changePasswordSubmitButton = document.getElementById('changePswSubmit');
    if(changePasswordSubmitButton)
        changePasswordSubmitButton.addEventListener('click', event => {
            main('changePsw');
        });

    //delete account event listener
    deleteAccountSubmitButton = document.getElementById('deleteAccountSubmit');
    if(deleteAccountSubmitButton)
        deleteAccountSubmitButton.addEventListener('click', event => {
            main('deleteAccount');
        });

}

setEventListeners();