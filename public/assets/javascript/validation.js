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


let validateSubmit = function(){
    let name = document.getElementById('name').value;
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
        window.open('/login');
    }
    })
    .catch((error) => {
    console.error('Error:', error);
    });

return false;

};