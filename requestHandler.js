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
const { response } = require('express');
const e = require('express');

let getRequests = function(app){

    //getting the login html page
    app.get('/login', function(req,res){
        res.render('login', { title: 'Log in' });
    });

    //home (9)same as login)
    app.get('/', function(req,res){
        res.redirect('/login');
        
    });

    //getting the sign up html page
    app.get('/signup', function(req,res){
        res.render('SignUp', { title: 'Sign Up' });
    });

    //getting the user profile html page
    app.get('/userprofile/:email', function(req,res){

        let email = req.params.email;
        console.log('email = ', email);

        db.collection('users').findOne({email: email}).then(profile => {
            res.render('userProfile', profile);
        });
    });
}

let postRequests = function(app){

    //validate the sign up form
    app.post('/signupvalidate', function(req, res){

        let response = {email: true, index: true};
        
        let result = db.collection('users').findOne({email: req.body.email}).then(function(object){
            if(object != null){
                response.email = false;
            }

            let result2 = db.collection('users').findOne({index: req.body.index}).then(function(object2){
                if(object2 != null){
                    response.index = false;
                }

                if(response.email === true && response.index === true){
                    database.addUser(req.body);
                }
                res.json(response);
            });
        });
        
    });


    app.post('/loginvalidate', function(req, res){

        let profile = db.collection('users').findOne({email: req.body.email}).then(profile => {
            if(profile === null){
                res.json({fault: 'email'});
            }
            else{
                if(req.body.password != profile.password){
                    res.json({fault: 'password'});
                }
                else{
                    res.json({fault: 'none'});
                }
            }
        });

    });
}