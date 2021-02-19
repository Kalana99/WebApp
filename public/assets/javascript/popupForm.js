let activePopupWindow           = null;             //to store the id of the currenly active window
let lastSearchTime              = new Date();       //get the current date and time

let popupMain = () => {

    let popupRequest                = document.querySelectorAll('.popup-request-window');   //get popup request forms
    let requestButtons              = document.querySelectorAll(".open-button-request");    //get request buttons
    let cancelButtons               = document.querySelectorAll('.close-button-request');   //get cancel buttons
    let popupWindow                 = document.querySelector('#popup-window');              //get the button to open logout window
    let logoutWindow                = document.querySelector('#logout-popup');              //get the logout window
    let logoutCancelButton          = document.querySelector('#cancel_logout');             //get logout cancel button
    let logoutSubmitButton          = document.querySelector('#submit_logout');             //get logout submit button
    let lecturerInput               = document.querySelectorAll('.lecturer');               //get lecturer input fields
    let suggestionsPanelLecturer    = document.querySelectorAll('.suggestions-lecturer');   //get lecturer suggestion panels

    //uncomment and insert correct name to check if the elements are captured correctly
    // console.log();

    openRequestForm(requestButtons, popupRequest);
    closeRequestForm(cancelButtons, popupRequest);
    openLogoutWindow(logoutWindow, popupWindow);
    closeLogoutWindow(logoutCancelButton, popupWindow);
    submitLogout(logoutSubmitButton);
    lecturerInputFunction(lecturerInput, suggestionsPanelLecturer);
};

//event listener to open request forms
let openRequestForm = (requestButtons, popupRequest) => {
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
};

//event listener to close request forms
//canceling a form won't refresh the page and input data will remain until the form being submitted
let closeRequestForm = (cancelButtons, popupRequest) => {
    for (let i = 0; i < cancelButtons.length; i++){
        cancelButtons[i].addEventListener('click', (event) => {
            //grab the id of the clicked cancel button
            let id = parseInt(event.currentTarget.id);
            activePopupWindow = null;
            let formControl = popupRequest[id].querySelectorAll('.form-control');
            formControl.forEach((div) => {
                div.className = 'form-control';
            });
    
            // clear the popup form when canceled
    
            popupRequest[id].className = 'popup-request-window';
        });
    };
};

//event listener to open logout window
let openLogoutWindow = (logoutWindow, popupWindow) => {
    if (logoutWindow !== null){
        logoutWindow.addEventListener('click', (event) => {

            if (activePopupWindow === null){
                activePopupWindow = event.target.id;
                popupWindow.className = 'popup-window visible';
            }
            
        });
    }
};

//event listener to close logout window
let closeLogoutWindow = (logoutCancelButton, popupWindow) => {
    if (logoutCancelButton !== null){
        logoutCancelButton.addEventListener('click', (event) => {
            event.preventDefault();
            activePopupWindow = null;
            popupWindow.className = 'popup-window';
        });
    }
};

//event listener to submit logout
let submitLogout = (logoutSubmitButton) => {
    if (logoutSubmitButton !== null){
        logoutSubmitButton.addEventListener('click', (event) => {
            // loading animation
            logoutSubmitButton.classList.toggle('loading');
            window.location.href = '/logout';
        });
    }
};

//event listener to get lecturer input suggestions and change the appearance of a selected lecturer field
let lecturerInputFunction = async (lecturerInput, suggestionsPanelLecturer) => {
    for (let i=0; i<lecturerInput.length; i++){

        lecturerInput[i].addEventListener('keyup', async () => {
            
            let input       = lecturerInput[i].value;
            let lecturerDiv = lecturerInput[i].parentElement;
        
            let response = await fetch('/getStaff', {
                method: 'POST', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                },
                
                body: JSON.stringify({input, time: new Date()}),
            });

            data = await response.json();

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

                                //hidden input to store the lecturers id
                                let form = event.currentTarget.closest('.popup-form');
                                let hiddenIdInput = document.createElement('input');
                                hiddenIdInput.setAttribute('type', 'hidden');
                                hiddenIdInput.setAttribute('name', 'staffId');
                                hiddenIdInput.setAttribute('value', event.currentTarget.id);
                                form.appendChild(hiddenIdInput);

    
                                lecturerInput[i].style.visibility = 'hidden';   //hide the lecturer input field
                                lecturerInput[i].style.position = 'absolute';
                                suggestionsPanelLecturer[i].innerHTML = '';     //empty the suggestion panel
    
                                let selected = document.createElement('div');
                                selected.setAttribute('class', 'selectedFinal');
                                selected.setAttribute('id', event.currentTarget.id);
                                selected.innerHTML = suggested.index + " - " + suggested.name;
                                
                                // a close button for selected lecturer
                                let remove = document.createElement('button');
                                remove.setAttribute('class', 'remove');
                                remove.setAttribute('type', 'button');
                                remove.innerText = 'x';
    
                                selected.appendChild(remove);
                                lecturerDiv.appendChild(selected);


                                //event listener to the remove button
                                document.querySelector('.remove').addEventListener('click', (event) => {
                                    // console.log('here');
                                    selected.remove();                                  //remove 'selected' div
                                    lecturerInput[i].style.visibility = 'inherit';
                                    lecturerInput[i].style.position = 'relative';
    
                                });
    
                            });
            
                            //make the suggestion panel empty if there's no input
                            if (input === '') {
                                suggestionsPanelLecturer[i].innerHTML = '';  
                            }
    
                            //select the first suggestion when enter is pressed
                            lecturerInput[i].addEventListener('keydown', (event) => {
                                if (event.keyCode === 13){
                                    //prevent the implicit submit of enter key
                                    event.preventDefault();
                                    //if enter is pressed, perform the click event on first option
                                    try{
                                        suggestionsPanelLecturer[i].firstChild.click();
                                    }
                                    catch(error){
                                        console.log(error);
                                    }
                                }
                            });
            
                        });
    
                    }
        
        });
    }
};

//call the main method
popupMain();