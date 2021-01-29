//popup request form
let popupRequest = document.querySelectorAll('.popup-request-window');

//add event listeners to all request buttons
let requestButtons = document.querySelectorAll(".open-button-request");

//keep only one window active at once
let activePopupWindow = null;

//eventListeners for open request forms buttons
for (let i = 0; i < requestButtons.length; i++){
    requestButtons[i].addEventListener('click', (event) => {
        //grab the id of the clicked button
        let id = parseInt(event.currentTarget.id);

        if (activePopupWindow === null){
            //get the active window id
            activePopupWindow = id;
            popupRequest[id].className = 'popup-request-window visible';
        }

    });
};

let cancelButtons = document.querySelectorAll('.close-button-request');

//eventListeners for cancel buttons
for (let i = 0; i < cancelButtons.length; i++){
    cancelButtons[i].addEventListener('click', (event) => {
        event.preventDefault();
        //grab the id of the clicked cancel button
        let id = parseInt(event.target.id);
        activePopupWindow = null;

        popupRequest[id].className = 'popup-request-window';
    });
};


//logout popup window
let popupWindow = document.getElementById('popup-window');

document.querySelector('#logout-popup').addEventListener('click', (event) => {

    if (activePopupWindow === null){
        activePopupWindow = event.target.id;
        popupWindow.className = 'popup-window visible';
    }
    
});

document.querySelector('#cancel_logout').addEventListener('click', (event) => {
    event.preventDefault();
    activePopupWindow = null;
    popupWindow.className = 'popup-window';
});

document.querySelector('#submit_logout').addEventListener('click', () => {
    window.location.href = '/logout';
});


// suggestion field

// suggestions for lecture modules
let modules = [
    {name: 'Computer Architecture'},
    {name: 'Principles of OOP'},
    {name: 'Numerical methods for cse'},
    {name: 'Theory of electricity'},
    {name: 'Data structures and algorithms'},
    {name: 'Communication skills'}
];
  
let lectureInput = document.querySelector('.lecture');
let suggestionsPanel = document.querySelector('.suggestions');

lectureInput.addEventListener('keyup', () => {
    let input = lectureInput.value;

    //make the panel empty for every input value
    suggestionsPanel.innerHTML = '';

    //.filter() returns a list
    let suggestions = modules.filter((module) => {
        return module.name.toLowerCase().includes(input);
    });

    //go through the filtered list of modules
    suggestions.forEach((suggested) => {
        let div = document.createElement('div');
        div.innerHTML = suggested.name;
        suggestionsPanel.appendChild(div);

        //select a suggestion
        div.addEventListener('click', () => {
            lectureInput.value = suggested.name;
            suggestionsPanel.innerHTML = ''; 
        });

        //function to get the enter key press
        lectureInput.addEventListener('keyup', (event) => {
            if (event.keyCode === 13){
                //prevent the implicit submit of enter key
                event.preventDefault();

                //if enter is pressed, perform the click event on div
                div.click();
            }
        });

    });

    //make the suggestion panel empty if there's no input
    if (input === '') {
        suggestionsPanel.innerHTML = '';  
    }
});

// suggestions for lecturers
//[{name: "", index: "", id: ""}]




let lecturerInput = document.querySelector('.lecturer');
let suggestionsPanelLecturer = document.querySelector('.suggestions-lecturer');

lecturerInput.addEventListener('keyup', () => {
    let input = lecturerInput.value;

    //make the panel empty for every input value
    suggestionsPanelLecturer.innerHTML = '';

    fetch('/getStaff', {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({input}),
        })
        .then(response => response.json())
        .then(data => {
            suggestionsPanelLecturer.innerHTML = '';
            //go through the filtered list of modules
            data.forEach((suggested) => {
                let div = document.createElement('div');
                div.setAttribute('id', suggested.id);
                div.innerHTML = suggested.name;
                suggestionsPanelLecturer.appendChild(div);

                //select a suggestion
                div.addEventListener('click', () => {
                    lecturerInput.value = suggested.name;
                    suggestionsPanelLecturer.innerHTML = ''; 
                });

                //make the suggestion panel empty if there's no input
                if (input === '') {
                    suggestionsPanelLecturer.innerHTML = '';  
                }

            });
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
    });

});