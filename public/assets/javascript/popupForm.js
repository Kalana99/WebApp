const form_name_array = ["ADD/DROP Requests", "Submitting Requests", "Repeat Exam Requests"];

function openForm(form_num){
    if (document.getElementsByClassName("form-popup")[form_num].style.display == "block"){
        document.getElementsByClassName("form-popup")[form_num].style.display = "none";
    }
    else{
        document.getElementsByClassName("form-popup")[form_num].style.display = "block";
        //haminena aulak thyenwa yata line eke
        document.getElementsByTagName("option")[0].innerHTML = form_name_array[form_num];
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

document.querySelector('#submit-logout').addEventListener('click', () => {
    
});