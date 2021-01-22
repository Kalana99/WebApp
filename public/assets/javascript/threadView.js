fetch('/getThreadData')
.then(response => response.json())
.then(data => {
    console.log(data);
});

// let btnGroup = document.getElementsByClassName('btn-group')[0];
// let msgButton = document.createElement('button');
// btnGroup.appendChild(msgButton);

// let msgDiv = document.createElement('div');
// msgDiv.setAttribute('class', 'msg-div');

// msgButton.appendChild(msgDiv);

