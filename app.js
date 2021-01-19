//requiring express and creating the express app
let express = require('express');
let app = express();

//requiring the other required files
let database = require('./database.js');
let User = require('./models/User');
let authRoutes = require('./routes/authRoutes');
let verificationRoutes = require('./routes/verificationRoutes');
let cookieParser = require('cookie-parser');
let {requireAuth} = require('./middleware/authMiddleware');

//disabling browser the cache for all web pages
app.use(function(req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
  });

//register view engine
app.set('view engine', 'ejs');
app.set('views', 'public');

//directing the static file requests
app.use('/css', express.static(__dirname + '/public/assets/css'));
app.use('/javascript', express.static(__dirname + '/public/assets/javascript'));
app.use('/resources', express.static(__dirname + '/public/resources'));
app.use('/svgsandimages', express.static(__dirname + '/public/assets/svgsandimages'));

//form data body parser
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//express routers and cookie parser
app.use(cookieParser());
app.use(authRoutes);
app.use(verificationRoutes);

//Connect to the database
let mongoose = require('mongoose');
const db = mongoose.connection;
mongoose.Promise = global.Promise;
let local = "mongodb://localhost/StudentRequestSystemDatabase";
mongoose.connect("mongodb+srv://akash:1234@nodetuts.wxb9o.mongodb.net/StudentRequestSystem?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => {
        app.listen(process.env.PORT || 3000); 
        console.log('You are listening to port 3000'); 
    })
    .catch((err) => console.log(err));
