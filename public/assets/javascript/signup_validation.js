form.addEventListener('submit', (event) => {
    event.preventDefault();
    console.log('here');
    checkInputs();
});

const checkInputs = () => {

    //for clientside signup validation
    let form = document.getElementById('form');
    let username = document.getElementById('username');
    let index = document.getElementById('index');
    let email = document.getElementById('email');
    let phone = document.getElementById('phone');
    let password = document.getElementById('password');
    let c_password = document.getElementById('c_psw');
    let birthday = document.getElementById('birthday');
    let male = document.getElementById('male');
    let female = document.getElementById('female');
    let student = document.getElementById('student')
    let staff = document.getElementById('staff');
    let faculty = document.getElementById('faculty');

    let isCorrect = true;
    //get the values from the inputs
    let userNameValue = username.value.trim();
    let indexValue = index.value.trim();
    let emailValue = email.value.trim();
    let phoneValue = phone.value.trim();
    let passwordValue = password.value.trim();
    let confirmPasswordValue = c_password.value.trim();
    let birthdayValue = birthday.value;
    let isMale = male.checked;
    let isFemale = female.checked;
    let isStudent = student.checked;
    let isStaff = staff.checked;
    let gender = "";
    let type = "";
    if(isMale){
        gender = "male";
    }
    else{
        gender = "female";
    }

    if(isStudent){
        type = "student";
    }
    else{
        type = "staff";
    }

    if (userNameValue === ''){
        //show error
        //add error class
        setError(username, 'Username cannot be blank');
        isCorrect = false;
    }
    else{
        //add success class
        setSuccess(username);
    }

    if (phoneValue === ''){
        setError(phone, 'telephone cannot be blank');
        isCorrect = false;
    }
    else{
        setSuccess(phone);
    }

    if (passwordValue === ''){
        setError(password, 'password cannot be blank');
        isCorrect = false;
    }
    else{
        setSuccess(password);
    }

    //check if the confirm and psw are the same
    if (confirmPasswordValue === ''){
        setError(c_password, 'you must confirm the password');
        isCorrect = false;
    }
    else if (passwordValue !== confirmPasswordValue){
        setError(c_password, 'password mismatch');
        isCorrect = false;
    }
    else{
        setSuccess(c_password);
    }

    if (birthdayValue === ''){
        setError(birthday, 'birthday cannot be blank');
        isCorrect = false;
    }
    else{
        setSuccess(birthday);
    }

    if (!(isMale || isFemale)){
        setError(male, 'choose a gender');
        isCorrect = false;
    }
    else{
        setSuccess(male);
    }

    if (!(isStudent || isStaff)){
        setError(student, 'choose an occupation');
        isCorrect = false;
    }
    else{
        setSuccess(student);
    }

    
    data = {
        name: userNameValue, index: indexValue, email: emailValue, birthday: birthdayValue, phone: phoneValue,
        password: passwordValue, faculty: faculty.value, gender: gender, type: type, isCorrect: isCorrect
    };

    fetch('/signup', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {

    //Checking the validity of the email provided
    if(data.email === false){
        setError(email, 'email already exists');
    }
    else if (emailValue === ''){
        setError(email, 'email cannot be blank');
        isCorrect = false;
    }
    else if (!isEmail(emailValue)){
        setError(email, 'email is not valid');
        isCorrect = false;
    }
    else{
        setSuccess(email);
    }

    //checking the index
    if(data.index === false){
        setError(index, 'index already exists');
    }
    else if (indexValue === ''){
        setError(index, 'index cannot be blank');
        isCorrect = false;
    }
    else{
        setSuccess(index);
    }
    if (data.index === true && data.email === true && isCorrect){
        window.location.href = '/verifyemail/' + document.getElementById('email').value;
    }
    })
    .catch((error) => {
    console.error('Error:', error);
    });

}

const isEmail = (email) => {
    //RegExr email validation
    //no need to understand
    //reference - https://codepen.io/FlorinPop17/pen/OJJKQeK
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}

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