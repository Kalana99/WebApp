let email = document.getElementById('emailp').innerText;

let link = document.getElementById('link');
let href = '/sendemailagain/' + email;
link.setAttribute('href',href );