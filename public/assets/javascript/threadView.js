fetch('/getThreadData')
.then(response => response.json())
.then(data => console.log(data));

let btnGroup = document.getElementsByClassName('btn-group')[0];

let msgDiv = document.createElement('div');
msgDiv.setAttribute('class', 'msg-div');

