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

function openForm(form_num){
    if (document.getElementsByClassName("form-popup")[form_num].style.display == "block"){
        document.getElementsByClassName("form-popup")[form_num].style.display = "none";
    }
    else{
        document.getElementsByClassName("form-popup")[form_num].style.display = "block";
        //haminena aulak thyenwa yata line eke
        document.getElementsByTagName("option")[form_num].innerHTML = form_name_array[form_num];
        // console.log(document.getElementsByTagName("option")[0].innerHTML = form_name_array[form_num]);
    }
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