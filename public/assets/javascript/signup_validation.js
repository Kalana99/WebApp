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



form.addEventListener('submit', (event) => {
    event.preventDefault();

    checkInputs();
});

const checkInputs = () => {
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

    if (indexValue === ''){
        setError(index, 'index cannot be blank');
        isCorrect = false;
    }
    else{
        setSuccess(index);
    }

    if (emailValue === ''){
        setError(email, 'email cannot be blank');
        isCorrect = false;
    }
    else if (!isEmail(emailValue)){
        setError(email, 'email is not valid');
        isCorrect = false;
    }
    else{
        setSuccess(email)
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

    //last condition in the function
    if (isCorrect){
        validateSubmit();
    }
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

//serverside login validation
let validateSubmit = () => {
    let name = document.getElementById('username');
    let index = document.getElementById('index');
    let email = document.getElementById('email');
    let birthday = document.getElementById('birthday');
    let phone = document.getElementById('phone');
    let password = document.getElementById('password');
    let faculty = document.getElementById('faculty');

    if (document.getElementById('male').checked) {
        gender = 'male';
    }
    else{
        gender = 'female';
    }

    if (document.getElementById('student').checked) {
        type = 'student';
    }
    else{
        type = 'staff';
    }

    data = {
        name: name.value, index: index.value, email: email.value, birthday: birthday.value, phone: phone.value,
        password: password.value, faculty: faculty.value, gender: gender.value, type: type.value
    };

    fetch('/signupvalidate', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
    if(data.email === false && data.index === true){
        setError(loginEmail, 'email already exists');
    }
    else if(data.index === false && data.email === true){
        setError(loginPassword, 'password does not match');
    }
    else if(data.email === false && data.index === false){
        setError(loginPassword, 'Error');
        setError(loginEmail, 'Error');
    }
    else{
        alert('logged in')
        window.open('/login');
    }
    })
    .catch((error) => {
    console.error('Error:', error);
    });

return false;

};