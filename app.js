//requiring express and creating the express app
let express = require('express');
let app = express();
let database = require('./database.js');
let User = require('./models/User');

//requiring the request controller
let requestController = require('./requestHandler.js');

//register view engine
app.set('view engine', 'ejs');
app.set('views', 'public');

//directing the static file requests
app.use('/css', express.static(__dirname + '/public/assets/css'));
app.use('/javascript', express.static(__dirname + '/public/assets/javascript'));
app.use('/resources', express.static(__dirname + '/public/resources'));

//form data body parser
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//Connect to the database
let mongoose = require('mongoose');
const db = mongoose.connection;
mongoose.Promise = global.Promise;
let local = "mongodb://localhost/StudentRequestSystemDatabase";
mongoose.connect("mongodb+srv://akash:1234@nodetuts.wxb9o.mongodb.net/StudentRequestSystem?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => {
        app.listen(3000); 
        console.log('You are listening to port 3000'); 
        requestController(app);
    })
    .catch((err) => console.log(err));

    