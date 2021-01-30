let main = (page) => {
    //the page parameter should be something like 'signUp' or 'login'
    //that indicates the place where the event is called

    //get the elements
    let nonEmpty        = document.querySelectorAll('.nonEmpty' + page);
    let normal          = document.querySelectorAll('.normal' + page);
    let selected        = document.querySelectorAll('.selected' + page);
    let existingPsw     = document.querySelectorAll('.existingPsw' + page);
    let newPsw          = document.querySelectorAll('.newPsw' + page);
    let existingEmail   = document.querySelectorAll('.existingEmail' + page);
    let newEmail        = document.querySelectorAll('.newEmail' + page);
    let index           = document.querySelectorAll('.index' + page);
    let nonEmptyRadio   = document.querySelectorAll('.nonEmptyRadio' + page);


    
    console.log(elements);

    //validate
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
