let correct = true;

let main = async (page) => {
    correct = true;
    //the page parameter should be something like 'signUp' or 'login'
    //that indicates the place where the event is called
    
    //get the elements
    let nonEmpty        = document.querySelectorAll('.nonEmpty.' + page);       //done
    let normal          = document.querySelectorAll('.normal.' + page);         //nothing to validate
    let selected        = document.querySelectorAll('.selected.' + page);       //
    let existingPsw     = document.querySelectorAll('.existingPsw.' + page);    //done
    let newPsw          = document.querySelectorAll('.newPsw.' + page);         //done
    let existingEmail   = document.querySelectorAll('.existingEmail.' + page);  //done
    let newEmail        = document.querySelectorAll('.newEmail.' + page);       //done
    let index           = document.querySelectorAll('.index.' + page);          //done
    let nonEmptyRadio   = document.querySelectorAll('.nonEmptyRadio.' + page);  //done
    let uploadingFile   = document.querySelectorAll('.file.' + page);

    //uncomment this block check if the inputs have all been identified

    // console.log(nonEmpty);
    // console.log(normal);
    // console.log(selected);
    // console.log(existingPsw);
    // console.log(newPsw);
    // console.log(existingEmail);
    // console.log(newEmail);
    // console.log(index);
    // console.log(nonEmptyRadio);
    // console.log(uploadingFile[0].files[0]);

    //validate nonEmpty
    await validateNonEmpty(nonEmpty);

    //validate existing password
    //validating the existing email and password will be called inside this method
    //if it applies to the current page
    await validateExistingPassword(existingPsw, existingEmail);

    //validate new email
    await validateNewEmail(newEmail);

    //validate newPsw and confirm Password
    await validateNewPassword(newPsw);

    //validate index
    await validateIndex(index);

    //validate nonEmptyRadio
    await validateNonEmptyRadio(nonEmptyRadio);

    //validate suggestion fields
    await validateSelected(selected);

    //submit if correct
    if(correct){
        await finalize(page, nonEmpty, normal, selected, existingPsw, newPsw, existingEmail, newEmail, index, nonEmptyRadio, uploadingFile);
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

let validateExistingPassword = async (pswInput, existingEmail) => {

    // If there is also an existing email input in the page, then go to the validate
    // existing email and password
    if(existingEmail.length > 0){
        console.log('here');
        await validateExistingEmailAndPassword(existingEmail, pswInput);
        return;
    }

    let password = null;
    let passwordValue;
    //if there is a password field,
    if (pswInput[0] != null){
        password = pswInput[0];
        passwordValue = password.value.trim();
        if (passwordValue === ''){
            passwordState = "blank";
        }
        else{
            let response = await fetch('/checkPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({password: passwordValue}),
                });
        
            data = await response.json();
            
            if(data.passwordCorrect){
                passwordState = 'success';
            }
            else{
                passwordState = 'wrong';
            }
    
            }
            if(passwordState === 'success'){
                setSuccess(password);
            }
            else if(passwordState === 'wrong'){
                setError(password, 'Please enter the correct password');
                correct = false;
            }
            else if(passwordState === 'blank'){
                setError(password, 'Current password cannot be blank');
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

//validate input fields that cannot be blank
let validateNonEmpty = async (nonEmpty) => {
    for (let i = 0; i < nonEmpty.length; i++){
        let input = nonEmpty[i];

        //to get the relevant error msg of what cannot be blank
        let fieldName = input.name;
        //capitalize the first letter of the fieldName
        let name = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
        let errMsg = name + " cannot be blank";

        if (input.value !== ''){
            setSuccess(input);
        }
        else{
            setError(input, errMsg);
            correct = false;
        }
    }
};

//validate new password and confirm password fields
let validateNewPassword = async (psw) => {
    if (psw.length !== 0){
        let newPswField = psw[0];
        let confirmPswField = psw[1];

        if (newPswField.value === ''){
            setError(newPswField, 'Password cannot be blank');
            correct = false;
        }
        else{
            setSuccess(newPswField);
            if (confirmPswField.value === ''){
                setError(confirmPswField, 'You must confirm the password');
                correct = false;
            }
            else if (confirmPswField.value.trim() !== newPswField.value.trim()){
                setError(confirmPswField, 'Password mismatch');
                correct = false;
            }
            else{
                setSuccess(confirmPswField);
            }
        }
    }
};

//validate index
let validateIndex = async (index) => {

    //indexStates --> blank, exists, notValid
    let indexState;

    for (let i = 0; i < index.length; i++){
        let indexElement = index[i];

        if (indexElement.value === ''){
            indexState = 'blank';
        }
        else{
            let requestData = {index: indexElement.value.trim()}

            let response = await fetch('/checkIndexExistence', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            let data = await (response.json());

            if (data.indexExists){
                indexState = 'exists';
            }
            else{
                indexState = 'success';
            }
        }

        if (indexState === 'blank'){
            setError(indexElement, 'Index cannot be blank');
            correct = false;
        }
        else if (indexState === 'exists'){
            setError(indexElement, 'Index already exists');
            correct = false;
        }
        else if (indexState === 'success'){
            setSuccess(indexElement);
        }
    }
};

//validate nonEmptyRadio
let validateNonEmptyRadio = async (radio) => {

    let radioState = 'unchecked';

    for (let i = 0; i < radio.length; i++){
        let radioBtn = radio[i]
        let errMsg = 'Choose a ' + radioBtn.name;

        let parentElement = radioBtn.parentElement;
        //get all options relevant to radioBtn
        let radioBtnList = parentElement.querySelectorAll('input');

        //check if at least one radio button is checked from a group
        for (let j = 0; j < radioBtnList.length; j++){
            if (radioBtnList[j].checked){
                radioState = 'checked';
                break;
            }
        }

        if (radioState === 'checked'){
            setSuccess(radioBtn);
        }
        else{
            setError(radioBtn, errMsg);
            correct = false;
        }
    }
};

//validate suggestion fields
let validateSelected = async (selected) => {
    for (let i = 0; i < selected.length; i++){
        
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

const finalize = async (page, nonEmpty, normal, selected, existingPsw, newPsw, existingEmail, newEmail, index, nonEmptyRadio, uploadingFile) => {
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
        console.log(document.querySelector('.selectedFinal').getAttribute('id'));
        data['type'] = 'addDrop';
        data['status'] = 'active';
        data['message'] = querySelectorFrom('.description', nonEmpty)[0].value;
        data['additionalData'] = {'requiredModule': querySelectorFrom('.requiredModule', nonEmpty)[0].value};
        data['module'] = querySelectorFrom('.currentModule', nonEmpty)[0].value;

        // {name: evidance.name, file: binary(req.files.uploadedFile.data)}
        let Evidance = querySelectorFrom('.addDrop', uploadingFile)[0].files[0];
        
        let formData = new FormData();
        formData.append("evidance", Evidance)

        data['evidance'] = formData;
 
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
        data['threadId'] = document.querySelector('.selected.threads').getAttribute('id');
        
        fetch('/reply', {
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                window.location.href = '/threads';
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

    else if(page === 'deleteAccount'){

        let data = {};

        fetch('/deleteAccount', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(data => {
                window.location.href = ('/logout');
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
            event.preventDefault();//remove
            main('addDrop');
        });

    //repeate request event listener
    repeatSubmitButton = document.getElementById('repeatSubmitButton');
    if(repeatSubmitButton)
        repeatSubmitButton.addEventListener('click', event => {
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