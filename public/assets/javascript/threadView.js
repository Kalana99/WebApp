fetch('/getThreadData')
.then(response => response.json())
.then(data => {
    // console.log(data);
    initialize(data);
});

let initialize = (arr) => {
    //button group
    let btnGroup = document.getElementsByClassName('btn-group')[0];

    for (let item = arr.length-1; item >= 0; item--){
        //create and set attributes to the elements
        let msgButton = document.createElement('button');
        msgButton.setAttribute('id', arr[item]._id);

        let msgDiv = document.createElement('div');
        msgDiv.setAttribute('class', 'msg-div');

        //basic display data of the request
        let divSender = document.createElement('div');
        divSender.setAttribute('class', 'item sender');

        let b = document.createElement('b');
        b.innerText = arr[item].name;

        let divDate = document.createElement('div');
        divDate.setAttribute('class', 'item date');
        
        let smallDate = document.createElement('small');
        smallDate.innerText = arr[item].createdAt;

        let divSnippet = document.createElement('div');
        divSnippet.setAttribute('class', 'item snippet');

        let smallSnippet = document.createElement('small');
        smallSnippet.innerText = arr[item].description;

        //append items in order and create the button group
        btnGroup.appendChild(msgButton);
        msgButton.appendChild(msgDiv);
        msgDiv.appendChild(divSender);
        divSender.appendChild(b);
        msgDiv.appendChild(divDate);
        divDate.appendChild(smallDate);
        msgDiv.appendChild(divSnippet);
        divSnippet.appendChild(smallSnippet);
    };
};
