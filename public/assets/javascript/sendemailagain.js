let id = document.getElementById('id').innerText;
console.log(id);

let link = document.getElementById('link');
let href = '/sendemailagain/' + id;
link.setAttribute('href',href );