// var check = function() {
//     if (document.getElementById('psw').value == document.getElementById('c_psw').value) {
//         document.getElementById('message').style.color = 'green';
//         document.getElementById('message').innerHTML = 'matching';   
//     } 
//     else {
//         document.getElementById('message').style.color = 'red';
//         document.getElementById('message').innerHTML = 'not matching';
//     }
//   }

let form = document.getElementById('form');
let username = document.getElementById('username');
let index = document.getElementById('index');
let email = document.getElementById('email');
let phone = document.getElementById('phone');
let password = document.getElementById('password');
let c_password = document.getElementById('c_psw');

form.addEventListener('submit', (event) => {
    event.preventDefault();

    checkInputs();
});

function checkInputs(){
    let isCorrect = true;
    //get the values from the inputs
    let userNameValue = username.value.trim();
    let indexValue = index.value.trim();
    let emailValue = email.value.trim();
    let phoneValue = phone.value.trim();
    let passwordValue = password.value.trim();
    let confirmPasswordValue = c_password.value.trim();

    if (userNameValue === ''){
        //show error
        //add error class
        setError(username, 'Username cannot be blank');
        isCorrect = false;
    }
    else{
        //add success class
        // setSuccess(username);
    }

    //last line
    if (isCorrect){
        validateSubmit();
    }
}

function setError(input, message){
    let formControl = input.parentElement; // .form-control
    let small = formControl.querySelector('small');

    //add error message inside small
    small.innerText = message;

    //add error class
    formControl.className = 'form-control error';
}


let validateSubmit = function(){
    let name = document.getElementById('username').value;
    let index = document.getElementById('index').value;
    let email = document.getElementById('email').value;
    let birthday = document.getElementById('birthday').value;
    let phone = document.getElementById('phone').value;
    let password = document.getElementById('password').value;
    let faculty = document.getElementById('faculty').value;

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
        name: name, index: index, email: email, birthday: birthday, phone: phone,
        password: password, faculty: faculty, gender: gender, type: type
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
        alert('email exists');
    }
    else if(data.index === false && data.email === true){
        alert('index exists');
    }
    else if(data.email === false && data.index === false){
        alert('index and exist');
    }
    else{
        alert('saved');
        window.location.href = '/login';
    }
    })
    .catch((error) => {
    console.error('Error:', error);
    });

return false;

};