let activePopupWindow           = null;             //to store the id of the currenly active window
let lastSearchTime              = new Date();       //get the current date and time
let popupRequestWindow          = document.querySelectorAll('.popup-request-window');
let lecturerInput               = document.querySelectorAll('.lecturer');               //get lecturer input fields
let suggestionsPanelLecturer    = document.querySelectorAll('.suggestions-lecturer');   //get lecturer suggestion panels

function dropSettings(){
    document.querySelector('.dropdown-content').classList.toggle('drop');
}

function togglePopup(){
    document.querySelector('.popup').classList.toggle('active');
}

function submitLogout(){
    document.querySelector('.submit-logout').classList.toggle('loading');
    window.location.href = '/logout';
}

function toggleAddDrop(){
    popupRequestWindow[0].classList.toggle('active');
}

function toggleSubmission(){
    popupRequestWindow[1].classList.toggle('active');
}

function toggleRepeat(){
    popupRequestWindow[2].classList.toggle('active');
}

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

lecturerInputFunction(lecturerInput, suggestionsPanelLecturer);