let activePopupWindow           = null;             //to store the id of the currenly active window
let lastSearchTime              = new Date();       //get the current date and time
let popupWindow                 = document.querySelectorAll('.popup-window');
let lecturerInput               = document.querySelectorAll('.lecturer');               //get lecturer input fields

// let suggestionsPanelLecturer    = document.querySelectorAll('.suggestions-lecturer');   //get lecturer suggestion panels

//event listener to get lecturer input suggestions and change the appearance of a selected lecturer field

//staff and student user profiles
let requestButtons = document.querySelector('.request-tiles');
requestButtons.classList.add('staff');

let getUserType = async () => {
    
};


let lecturerInputFunction = async (lecturerInput) => {
    for (let i=0; i<lecturerInput.length; i++){

        let suggestionPanel = document.createElement('div');
        suggestionPanel.setAttribute('class', 'suggestions-lecturer');

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
                        // suggestionsPanelLecturer[i].innerHTML = '';

                        suggestionPanel.innerHTML = '';
    
                        data.lecturers.forEach((suggested) => {
                            let option = document.createElement('option');
    
                            option.setAttribute('id', suggested.id);
                            option.innerText = suggested.index + " - " + suggested.name;
                            suggestionPanel.appendChild(option);

                            lecturerDiv.appendChild(suggestionPanel);
            
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
                                suggestionPanel.remove()    //empty the suggestion panel
    
                                let selected = document.createElement('div');
                                selected.setAttribute('class', 'selectedFinal');
                                selected.setAttribute('id', event.currentTarget.id);
                                selected.innerHTML = suggested.index + " - " + suggested.name;
                                
                                // a close button for selected lecturer
                                let closeBtn = document.createElement('div');
                                closeBtn.setAttribute('class', 'closeBtn');
                                closeBtn.innerText = 'x';
    
                                selected.appendChild(closeBtn);
                                lecturerDiv.appendChild(selected);


                                //event listener to the remove button
                                document.querySelector('.closeBtn').addEventListener('click', (event) => {
                                    selected.remove();                                  //remove 'selected' div
                                    lecturerInput[i].style.visibility = 'inherit';
                                    lecturerInput[i].style.position = 'relative';
    
                                });
    
                            });
            
                            //make the suggestion panel empty if there's no input
                            if (input === '') {

                                if (lecturerDiv.childElementCount > 1){
                                    lecturerDiv.removeChild(lecturerDiv.lastChild);
                                }
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
lecturerInputFunction(lecturerInput);

//settings dropdown list
function dropSettings(){
    document.querySelector('.dropdown-content').classList.toggle('drop');
}

//notifications dropdown list
function dropNotifications(){
    document.querySelector('.dropdown-notification').classList.toggle('drop');
}

function toggleLogout(){
    popupWindow[0].classList.toggle('active');
}

function submitLogout(){
    document.querySelector('.submit-logout').classList.toggle('loading');
    window.location.href = '/logout';
}

function toggleAddDrop(){
    popupWindow[1].classList.toggle('active');
}

function toggleSubmission(){
    popupWindow[2].classList.toggle('active');
}

function toggleRepeat(){
    popupWindow[3].classList.toggle('active');
}

function toggleReply(){
    popupWindow[0].classList.toggle('active');
    // document.querySelector('.overlay').style.display = 'block';
}

function toggleConfirm(){
    popupWindow[1].classList.toggle('active');
}

// ------------------------------------------------------------------------------

let inputs = document.querySelectorAll( '.file' );

inputs.forEach(input => {
    let label = input.nextElementSibling;
    let labelVal = label.innerHTML;

    label.addEventListener('click', () => {
        input.click();
    });

    input.addEventListener('change', (event) => {
        let fileName = '';

        if (this.files && this.files.length > 1){
            fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);
        }
        else{
            fileName = event.target.value.split('\\').pop();
        }

        if (fileName){
            label.querySelector('span').innerHTML = fileName;
        }
        else{
            label.innerHTML = labelVal;
        }
    });
});