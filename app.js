//requiring express and creating the express app
let express = require('express');
let app = express();
let database = require('./database.js');
let User = require('./models/User');

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
const db = mongoose.connection;
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/testaroo", {useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => {
        app.listen(3000); 
        console.log('You are listening to port 3000'); 
        requestController(app);
    })
    .catch((err) => console.log(err));