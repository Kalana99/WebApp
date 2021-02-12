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
        let id = event.currentTarget.id;
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

// // suggestions for lecture modules
// let modules = [
//     {name: 'Computer Architecture'},
//     {name: 'Principles of OOP'},
//     {name: 'Numerical methods for cse'},
//     {name: 'Theory of electricity'},
//     {name: 'Data structures and algorithms'},
//     {name: 'Communication skills'}
// ];
  
// let lectureInput = document.querySelectorAll('.lecture');
// let suggestionsPanel = document.querySelectorAll('.suggestions');

// for (let i = 0; i < lectureInput.length; i++){
//     lectureInput[i].addEventListener('keyup', () => {
//         let input = lectureInput[i].value;
    
//         //make the panel empty for every input value
//         suggestionsPanel[i].innerHTML = '';
    
//         //.filter() returns a list
//         let suggestions = modules.filter((module) => {
//             return module.name.toLowerCase().includes(input);
//         });
    
//         //go through the filtered list of modules
//         suggestions.forEach((suggested) => {
//             let option = document.createElement('option');
//             option.innerHTML = suggested.name;
//             suggestionsPanel[i].appendChild(option);
    
//             //select a suggestion
//             option.addEventListener('click', () => {
//                 lectureInput[i].value = suggested.name;
//                 suggestionsPanel[i].innerHTML = ''; 
//             });
    
//             //function to get the enter key press
//             lectureInput[i].addEventListener('keyup', (event) => {
//                 if (event.keyCode === 13){
//                     //prevent the implicit submit of enter key
//                     event.preventDefault();
    
//                     //if enter is pressed, perform the click event on div
//                     option.click();option
//                 }
//             });
    
//         });
    
//         //make the suggestion panel empty if there's no input
//         if (input === '') {
//             suggestionsPanel[i].innerHTML = '';  
//         }
//     });
// }


//[{name: "", index: "", id: ""}]

let lecturerInput               = document.querySelectorAll('.lecturer');
let suggestionsPanelLecturer    = document.querySelectorAll('.suggestions-lecturer');
let popupBox                    = document.querySelector('.input-field');
let lecturerDiv                 = document.querySelector('.lecturerDiv');
//to get the suggestion according to the last input value
let lastSearchTime = new Date();

//add an event listener to all lecturer input fields in all three forms
for (let i=0; i<lecturerInput.length; i++){
    lecturerInput[i].addEventListener('keyup', () => {
        //get the value in lecturer input field
        let input = lecturerInput[i].value;
        let lecturerDiv = lecturerInput[i].parentElement;
    
        //request suggestions from database staff profiles
        fetch('/getStaff', {
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
            },
            //send the input value in text input field and the time it is entered
            body: JSON.stringify({input, time: new Date()}),
            })
            .then(response => response.json())
            .then(data => {
                
                let dataTime = Date(data.time);
    
                //display the suggestions from the last input value
                if(dataTime.valueOf() < lastSearchTime.valueOf){
                    lastSearchTime = data.time;
    
                    //suggestion panel should be empty at the beginning
                    suggestionsPanelLecturer[i].innerHTML = '';

                    data.lecturers.forEach((suggested) => {
                        let option = document.createElement('option');

                        option.setAttribute('id', suggested.id);
                        option.innerText = suggested.index + " - " + suggested.name;
                        suggestionsPanelLecturer[i].appendChild(option);
        
                        //add an event listener to every suggestion to get the value into the input field when clicked
                        option.addEventListener('click', (event) => {

                            //change the appearance of the selected suggestion
                            lecturerDiv.innerHTML = '';
                            // lecturerInput[i].style.visibility = 'hidden';
                            suggestionsPanelLecturer[i].innerHTML = '';

                            let selected = document.createElement('div');
                            selected.setAttribute('class', 'selectedFinal');
                            selected.setAttribute('id', event.currentTarget.id);

                            selected.innerHTML = suggested.name;
                            lecturerDiv.innerHTML = "<div class='selectedFinal' id=''></div>";
                            
                            //a close button
                            let remove = document.createElement('button');
                            remove.setAttribute('class', 'remove');
                            remove.innerHTML = "<small>x</small>";
                            selected.appendChild(remove);

                            remove.addEventListener('click', (event) => {
                                event.preventDefault();

                                selected.style.visibility = 'hidden';
                                lecturerInput[i].style.visibility = 'visible';
                            });

                        });
        
                        //make the suggestion panel empty if there's no input
                        if (input === '') {
                            suggestionsPanelLecturer[i].innerHTML = '';  
                        }
        
                    });

                    lecturerInput[i].addEventListener('keypress', (event) => {
                        if (event.keyCode === 13){
                            //prevent the implicit submit of enter key
                            event.preventDefault();
            
                            //if enter is pressed, perform the click event on div
                            option.click();
                        }
                    });

                }
                
            })
            .catch((error) => {
                console.error('Error:', error);
        });
    
    });
}