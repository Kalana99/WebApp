let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect("mongodb+srv://oshi:1234@nodetuts.wxb9o.mongodb.net/StudentRequestSystem?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
const database = require('./database');

module.exports = function(app){
    getRequests(app);
    postRequests(app);
}
let User = require('./models/User');

let getRequests = function(app){


    app.get('/home', function(req,res){
        res.render('login', { title: 'Log in' });
    });

    app.get('/', function(req,res){
        res.redirect('/home');
        
    });

    app.get('/signup', function(req,res){
        res.render('SignUp', { title: 'Sign Up' });
    });
}

let postRequests = function(app){

    app.post('/home', function(req, res){
        database.addUser(req.body);
    });

}