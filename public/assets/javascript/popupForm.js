// const form_name_array = ["ADD/DROP Requests", "Submitting Requests", "Repeat Exam Requests"];

//popup request form
let popupRequest = document.querySelector('#popup-request-window');

document.querySelector('.open-button-request').addEventListener('click', () => {
    popupRequest.className = 'popup-request-window visible';
});

document.querySelector('.close-button-request').addEventListener('click', () => {
    popupRequest.className = 'popup-request-window';
});


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
    window.location.href = '/logout';
});