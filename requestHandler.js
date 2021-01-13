let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect("mongodb+srv://akash:1234@nodetuts.wxb9o.mongodb.net/StudentRequestSystem?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
const database = require('./database');
const mail = require('./modules/email');

module.exports = function(app){
    getRequests(app);
    postRequests(app);
}
let User = require('./models/User');

let getRequests = function(app){


    app.get('/login', function(req,res){
        res.render('login', { title: 'Log in' });
    });

    app.get('/', function(req,res){
        res.redirect('/login');
        
    });

    app.get('/signup', function(req,res){
        res.render('SignUp', { title: 'Sign Up' });
    });

    app.get('/userprofile', function(req,res){
        res.render('userProfile', { title: 'Sign Up' });
    });
}

let postRequests = function(app){

    app.post('/home', function(req, res){
        database.addUser(req.body);
        res.redirect('/login');
    });

    app.post('/login', function(req, res){
        console.log(req.body);
    });

}