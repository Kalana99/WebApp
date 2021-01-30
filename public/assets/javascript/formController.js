let main = (page) => {
    //the page parameter should be something like 'signUp' or 'login'
    //that indicates the place where the event is called

    //get the elements
    let elements = document.querySelectorAll('.' + page);


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
