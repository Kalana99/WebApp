let a = () => {

    let email = document.querySelector('body > div > main > div > div.profile-div > p:nth-child(5)').textContent;
    fetch('/verifyloggedin/' + email)
  .then(response => response.json())
  .then(data => {
    console.log(data);
      if(!data.loggedin){
        window.location.href = '/login';
      }
  });
};

a();

const form_name_array = ["ADD/DROP Requests", "Submitting Requests", "Repeat Exam Requests"];

//popup request form
let popupRequest = document.querySelector('#popup-request-window');
let requestSelector = document.getElementById('request-option');
function openForm(form_num){
    popupRequest.className = 'popup-request-window visible';
    requestSelector.innerText = form_name_array[form_num];
}

function closeForm(){
    popupRequest.className = 'popup-request-window';

    return false;
}

//logout popup window
let popupWindow = document.getElementById('popup-window');

document.querySelector('#logout-popup').addEventListener('click', () => {
    popupWindow.className = 'popup-window visible';
});

document.querySelector('#cancel_logout').addEventListener('click', () => {
    popupWindow.className = 'popup-window';
});

document.querySelector('#submit_logout').addEventListener('click', () => {
    let email = document.querySelector('body > div > main > div > div.profile-div > p:nth-child(5)').textContent;
    window.location.href = '/logout/' + email;
});