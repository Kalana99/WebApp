let form = document.getElementById('form');

const setError = (input, message) => {
    let formControl = input.parentElement; // .form-control
    let small = formControl.querySelector('small');
    console.log(formControl)
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

form.addEventListener('submit', (event) => {
    event.preventDefault();

    serverSideValidateSubmit();
});

let serverSideValidateSubmit = function(){
    let current_password = document.getElementById('current_password');
    let new_password = document.getElementById('new_password');
    let confirm_password = document.getElementById('confirm_password');

    data = {
        current_password: current_password.value,
        new_password: new_password.value,
        confirm_password: confirm_password.value
    };

    fetch('/changePassword', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            if(data.fault === 'current_password'){
                setError(current_password, 'password mismatch');
                //removeError(password);
            }
            else if(data.fault === 'new_password'){
                setSuccess(current_password);
                setError(new_password, 'this field is required');
            }
            else if(data.fault === 'confirm_password'){
                setSuccess(new_password);
                setError(confirm_password, 'this field is required');
            }
            else if(data.fault === 'unmatched'){
                setError(confirm_password, 'mismatched with the new password');
            }
            else{
                window.location.href = ('/changePassword');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
};