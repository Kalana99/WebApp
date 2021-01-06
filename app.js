//requiring express and creating the express app
let express = require('express');
let app = express();

//requiring the request controller
let requestController = require('./requestHandler.js');

//directing the static file requests
app.use('/css', express.static(__dirname + '/public/assets/css'));
app.use('/javascript', express.static(__dirname + '/public/assets/javascript'));

requestController(app);
app.listen(3000);

