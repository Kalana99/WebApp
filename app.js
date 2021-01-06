//requiring express and creating the express app
let express = require('express');
let app = express();

//requiring the request controller
let requestController = require('./requestHandler.js');

//directing the static file requests
app.use('/css', express.static(__dirname + '/public/assets/css'));
app.use('/javascript', express.static(__dirname + '/public/assets/javascript'));

//form data body parser
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//Connect to the database
let mongoose = require('mongoose');
let dbURI = 'mongodb+srv://oshi:1232@nodetuts.wxb9o.mongodb.net/Nodetuts?retryWrites=true&w=majority';
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => {app.listen(3000); console.log('You are listening to port 3000');})
    .catch((err) => console.log(err));

requestController(app);