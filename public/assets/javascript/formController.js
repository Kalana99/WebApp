// const { set } = require("mongoose");

let correct = true;
let sentPin = null;

let main = async (page) => {
    correct = true;
    //the page parameter should be something like 'signUp' or 'login'
    //that indicates the place where the event is called
    
    //get the elements
    let nonEmpty            = document.querySelectorAll('.nonEmpty.' + page);
    let normal              = document.querySelectorAll('.normal.' + page);
    let selected            = document.querySelectorAll('.selected.' + page);
    let existingPsw         = document.querySelectorAll('.existingPsw.' + page);
    let newPsw              = document.querySelectorAll('.newPsw.' + page);
    let existingEmail       = document.querySelectorAll('.existingEmail.' + page);
    let newEmail            = document.querySelectorAll('.newEmail.' + page);
    let index               = document.querySelectorAll('.index.' + page);
    let nonEmptyRadio       = document.querySelectorAll('.nonEmptyRadio.' + page);
    let forgotPswEmail      = document.querySelectorAll('.forgotPswEmail.' + page);

    //buttons that needs loading animation
    let button          = document.querySelector('.button.' + page);

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
    // console.log(question);
    // console.log(forgotPswEmail);
    // console.log(forgotPswQuestion);

    //validate nonEmpty
    await validateNonEmpty(nonEmpty);

    //validate existing password
    //validating the existing email and password will be called inside this method
    //if it applies to the current page
    await validateExistingPassword(existingPsw, existingEmail);

    //validate new email
    await validateNewEmail(newEmail);

    //validate newPsw and confirm Password
    await validateNewPassword(existingPsw, newPsw);

    //validate index
    await validateIndex(index);

    //validate nonEmptyRadio
    await validateNonEmptyRadio(nonEmptyRadio);

    //validate suggestion fields
    await validateSelected(selected);

    //validate forgot password page
    await validateForgotPassword(forgotPswEmail);

    //submit if correct
    if(correct){
        //loading animation for buttons
        if (button !== null){
            button.classList.toggle('loading');
        }

        await finalize(page, nonEmpty, normal, selected, existingPsw, newPsw, existingEmail, newEmail, index, nonEmptyRadio, forgotPswEmail);
    };
};

//----------------------------------------------------------------------------------------

//email validation regExr
async function isEmail(email){
    //RegExr email validation
    //no need to understand
    //reference - https://codepen.io/FlorinPop17/pen/OJJKQeK
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}

//login validation front and back
let validateExistingEmailAndPassword = async (emailInput, pswInput) => {

    // let loginButton = document.querySelector('.loginButton');
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
        else if (! await (isEmail(emailValue))){
            emailState = "invalid";
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
        else if (emailState === "invalid"){
            setError(email, "Invalid email");
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

//validate only existing password
let validateExistingPassword = async (pswInput, existingEmail) => {

    // If there is also an existing email input in the page, then go to the validate
    // existing email and password
    if(existingEmail.length > 0){
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
            setError(email, 'Not a valid Email');
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
let validateNewPassword = async (oldPsw, psw) => {
    if (psw.length !== 0){
        let newPswField = psw[0];
        let confirmPswField = psw[1];

        if (newPswField.value === ''){
            setError(newPswField, 'Password cannot be blank');
            correct = false;
        }
        //check if there is an old password field
        //and if the old password is equal to the new password
        else if ((oldPsw.length > 0) && (oldPsw[0].value === newPswField.value)){
            setError(newPswField, 'Cannot use the same password as before');
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
    // console.log(selected);
    // console.log(selected.length);
    for (let i = 0; i < selected.length; i++){

        let input = selected[i].parentElement;

        //if a lecturer is selected, then the last element in input would be s
        //elected and its class name = selectedFinal
        if (input.lastChild.className !== 'selectedFinal'){
            setError(input, 'You need to choose a lecturer');
            correct = false;
        }
        else{
            setSuccess(input);
        }
    }
};

//validate everything in forgot password
let validateForgotPassword = async (forgotPswEmail) => {

    //backend validation

    let emailState = null;

    for (let i = 0; i < forgotPswEmail.length; i++){

        let email           = forgotPswEmail[i];
        let emailValue      = email.value.trim();

        if (emailValue === ''){
            emailState = "blank";
        }
        else if (! await (isEmail(emailValue))){
            emailState = "invalid";
        }
        else{
            let requestData = {};

            requestData['email'] = emailValue;
            localStorage.setItem('email', emailValue);

            let response = await fetch('/getEmailandPin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });
    
            data = await response.json();
            sentPin = data.sentPin;
            
            if (data.emailExists){
                emailState = "success";
            }
            else{
                emailState = "error";
            }
    
        }

        //set error messages according to the field states
        if (emailState === 'blank'){
            setError(forgotPswEmail[i], 'Email cannot be blank');
            correct = false;
        }
        else if (emailState === 'invalid'){
            setError(forgotPswEmail[i], 'Invalid email');
            correct = false;
        }
        else if (emailState === 'error'){
            setError(forgotPswEmail[i], 'Email does not exist');
            correct = false;
        }
        else if (emailState === 'success'){
            setSuccess(forgotPswEmail[i]);
            let submitBtn = document.querySelector('#forgotPasswordSubmit');
            let formControlBtn = submitBtn.parentElement;

            submitBtn.style.display = 'none';

            addPinSubmit(formControlBtn);

        }

    }
};

function addPinSubmit(formControlBtn){
    let formControl = document.createElement('div');
    formControl.setAttribute('class', 'form-control');
    // add pincode input field
    let pinInput = document.createElement('input');
    pinInput.setAttribute('class', 'pinCode forgotPassword');
    pinInput.setAttribute('type', 'text');
    pinInput.setAttribute('name', 'pin');
    pinInput.setAttribute('placeholder', 'Enter your pin');

    formControl.appendChild(pinInput);

    let successIcon = document.createElement('i');
    successIcon.setAttribute('class', 'fa fa-check-circle');
    let errorIcon = document.createElement('i');
    errorIcon.setAttribute('class', 'fa fa-exclamation-circle');
    let errorMsg = document.createElement('small');
    errorMsg.innerText = 'Error message';

    formControl.appendChild(successIcon);
    formControl.appendChild(errorIcon);
    formControl.appendChild(errorMsg);

    // add formControl to the form
    let form = document.querySelector('.form');
    form.insertBefore(formControl, form.childNodes[2]);

    // add pinsubmit button
    let pinSubmitBtn = document.createElement('button');
    pinSubmitBtn.setAttribute('type', 'button');
    pinSubmitBtn.setAttribute('class', 'button forgotPassword');
    pinSubmitBtn.setAttribute('id', 'pinSubmitBtn');
    pinSubmitBtn.setAttribute('onclick', 'submitPin()');
    let buttonText = document.createElement('span');
    buttonText.setAttribute('class', 'buttonText');
    buttonText.innerText = "Confirm";
    pinSubmitBtn.appendChild(buttonText);
    formControlBtn.appendChild(pinSubmitBtn);
}

function submitPin(){
    let pinInput = document.querySelector('.pinCode.forgotPassword');
    // let formControl = pinInput.parentElement;

    let pin = pinInput.value;
    
    if (pin === ''){
        setError(pinInput, 'Enter pin number');
    }
    else if (sentPin == pin){
        setSuccess(pinInput);
        window.location.href = '/forgotChangePsw';
    }
    else if (sentPin != pin){
        setError(pinInput, 'Wrong pin number');
    }
}

// profile picture edit function
let inputDP = document.querySelector('.fileEditProfile');

function editProfilePic(){
    inputDP.click();

    inputDP.onchange = function(event){
        let formElement = document.querySelector('#EditProfileForm');
        formElement.submit();
    }
}

//-----------------------toggle password view------------------------------------------
let toggleView      = document.querySelectorAll('.far');

let togglePasswordView = async (toggleView) => {
    for (let i = 0; i < toggleView.length; i++){
        let pswField = toggleView[i].parentElement.querySelector('input');

        toggleView[i].addEventListener('click', (event) => {
            // toggle the type attribute
            let type = pswField.getAttribute('type') === 'password' ? 'text' : 'password';
            pswField.setAttribute('type', type);
            // toggle the eye slash icon
            toggleView[i].classList.toggle('fa-eye-slash');
        });
    }
};

togglePasswordView(toggleView);

// ----------------------validation messages--------------------------------------------

//set error message and icon
const setError = (input, message) => {
    let formControl = input.parentElement; // .form-control
    let small = formControl.querySelector('small');

    //add error message inside small
    small.innerText = message;

    //add error class
    formControl.className = 'form-control error';
}

//set success icon
const setSuccess = (input) => {
    let formControl = input.parentElement; // .form-control

    //add success class
    formControl.className = 'form-control success';
}

//remove any error message and icon
const removeError = (input) => {
    let formControl = input.parentElement; // .form-control
    let small = formControl.querySelector('small');

    small.innerText = "";
    formControl.className = 'form-control';
}

//only used in edit profile page
const deepRemoveError = (input) => {
    let formControl = input.parentElement.parentElement; // .form-control
    let small = formControl.querySelector('small');

    small.innerText = "";
    formControl.className = 'form-control';
}

//-----------------------edit profile buttons---------------------------------------------

let editButtons = document.querySelectorAll('.edit');

//add event listeners to edit buttons in editProfile
let addEditListeners = (editButtons) => {
    for (let i = 0; i < editButtons.length; i++){

        let editBtn = editButtons[i];

        //edit button container
        let container   = editBtn.parentElement;
        let formControl = container.parentElement;
        //input field container
        // let inputDiv    = formControl.querySelector('.inputDiv');
        //name for the input field
        let fieldName   = container.querySelector('label').className;
        
        editBtn.addEventListener('click', (event) => {

            //toggle button functionality as edit and cancel
            let text = editBtn.querySelector('.buttonText').innerText;

            if (text === 'Edit'){

                //create common input field and set some common attributes
                let input = document.createElement('input');
                input.setAttribute('type', 'text');
                input.setAttribute('name', fieldName);

                //set unique attributes
                if (fieldName === 'username'){
                    input.setAttribute('class', 'nonEmpty editProfile userName');   
                }
                else if (fieldName === 'index'){
                    input.setAttribute('class', 'index editProfile');
                }
                else if (fieldName === 'phone'){
                    input.setAttribute('class', 'nonEmpty editProfile phone');
                }
                else if (fieldName === 'birthday'){
                    input.setAttribute('class', 'nonEmpty editProfile birthday');
                    input.setAttribute('type', 'date');

                }
                //create a different input field for gender and append child
                else if (fieldName === 'gender'){
                    //radio buttons
                    let radioInputMale = document.createElement('input');
                    let radioInputFemale = document.createElement('input');

                    //labels
                    let labelMale = document.createElement('label');
                    let labelFemale = document.createElement('label');

                    radioInputMale.setAttribute('class', 'nonEmptyRadio editProfile gender');
                    radioInputMale.setAttribute('type', 'radio');
                    radioInputMale.setAttribute('name', 'gender');
                    radioInputMale.setAttribute('value', 'male');

                    radioInputFemale.setAttribute('type', 'radio');
                    radioInputFemale.setAttribute('name', 'gender');
                    radioInputFemale.setAttribute('value', 'female');

                    labelMale.setAttribute('for', 'male');
                    labelMale.innerText = 'Male';
                    labelFemale.setAttribute('for', 'female');
                    labelFemale.innerText = 'Female';

                    formControl.insertBefore(labelFemale, formControl.childNodes[2]);
                    formControl.insertBefore(radioInputFemale, formControl.childNodes[2]);
                    formControl.insertBefore(labelMale, formControl.childNodes[2]);
                    formControl.insertBefore(radioInputMale, formControl.childNodes[2]);

                }

                //append children that is not gender
                if (fieldName !== 'gender'){
                    formControl.insertBefore(input, formControl.childNodes[2]);
                }

                //change the edit button as cancel
                editBtn.innerHTML = '<span class="buttonText">Cancel</span>';
            }
            else{
                //remove the input fields when canceled
                if (fieldName !== 'gender'){
                    formControl.removeChild(formControl.childNodes[2]);
                }
                else{
                    formControl.removeChild(formControl.childNodes[2]);
                    formControl.removeChild(formControl.childNodes[2]);
                    formControl.removeChild(formControl.childNodes[2]);
                    formControl.removeChild(formControl.childNodes[2]);
                }
                editBtn.innerHTML = '<span class="buttonText">Edit</span>';
                deepRemoveError(editBtn);
            }
        });
    }
};

addEditListeners(editButtons);

// ---------------------------------------------------------------------------------------

const finalize = async (page, nonEmpty, normal, selected, existingPsw, newPsw, existingEmail, newEmail, index, nonEmptyRadio, forgotPswEmail) => {
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

        let formElement = document.querySelector('#signUpForm');
        
        formElement.submit();

    }

    else if(page === 'addDrop'){

        let formElement = document.querySelector('#addDropForm');

        //creating hidden element for request type

        let hiddenIdInput = document.createElement('input');
        hiddenIdInput.setAttribute('type', 'hidden');
        hiddenIdInput.setAttribute('name', 'type');
        hiddenIdInput.setAttribute('value', 'addDrop');
        formElement.appendChild(hiddenIdInput);
        
        formElement.submit();

    }

    else if(page === 'repeat'){

        let formElement = document.querySelector('#repeatForm');

        //creating hidden element for request type

        let hiddenIdInput = document.createElement('input');
        hiddenIdInput.setAttribute('type', 'hidden');
        hiddenIdInput.setAttribute('name', 'type');
        hiddenIdInput.setAttribute('value', 'repeat');
        formElement.appendChild(hiddenIdInput);

        formElement.submit();

    }

    else if(page === 'submission'){

        let formElement = document.querySelector('#submissionForm');

        //creating hidden element for request type

        let hiddenIdInput = document.createElement('input');
        hiddenIdInput.setAttribute('type', 'hidden');
        hiddenIdInput.setAttribute('name', 'type');
        hiddenIdInput.setAttribute('value', 'submission');
        formElement.appendChild(hiddenIdInput);

        formElement.submit();

    }

    else if(page === 'thread'){

        //creating hidden element for thread id

        let formElement = document.querySelector('#replyForm');

        let hiddenIdInput = document.createElement('input');
        hiddenIdInput.setAttribute('type', 'hidden');
        hiddenIdInput.setAttribute('name', 'threadId');
        hiddenIdInput.setAttribute('value', document.querySelector('.selected.threads').getAttribute('id'));
        formElement.appendChild(hiddenIdInput);

        formElement.submit();

    }

    else if(page === 'editProfile'){

        let formElement = document.querySelector('#EditProfileForm');

        formElement.submit();
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

    else if(page === 'forgotChangePsw'){

        data = {};

        data['new_password'] = newPsw[0].value;
        data['email']        = localStorage.getItem("email");
        
        fetch('/forgotChangePsw', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(data => {
                window.location.href = '/login';
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
    
    //edit profile event listener
    editProfileSubmitButton = document.getElementById('editProfileSubmit');
    if(editProfileSubmitButton)
        editProfileSubmitButton.addEventListener('click', event => {
            main('editProfile');
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

    //forgot password event listener
    forgotPasswordSubmitButton = document.getElementById('forgotPasswordSubmit');
    if(forgotPasswordSubmitButton)
        forgotPasswordSubmitButton.addEventListener('click', event => {
            main('forgotPassword');
        });

    //forgot password change event listener
    forgotChangePswSubmitButton = document.getElementById('forgotChangePswSubmit');
    if(forgotChangePswSubmitButton)
        forgotChangePswSubmitButton.addEventListener('click', event => {
            main('forgotChangePsw');
        });

}

setEventListeners();