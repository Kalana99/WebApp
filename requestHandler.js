let mongoose = require('mongoose');
let mongodb = require('mongodb');
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
const email = require('./modules/email');

let getRequests = function(app){


    //home (9)same as login)
    app.get('/', function(req,res){
        console.log('here');
        res.render('login');
    });

    //getting the user profile html page
    app.get('/userprofile/:email', function(req,res){

        let email = req.params.email;

        db.collection('users').findOne({email: email}).then(profile => {
            if(!profile.loggedin){
                res.redirect('/login');
            }
            else{
                db.collection('users').findOne({email: email}).then(profile => {
                    console.log(profile);
                    res.render('userProfile', profile);
                });
            }
        });
        
    });

    app.get('/verify/:id', function(req, res){
        let s_id = req.params.id;
        let o_id = new mongodb.ObjectID(s_id)
        database.updateOne('users', {_id: o_id }, {verified: true});
        res.render('verified');
    });

    app.get('/verifyemail/:email', function(req, res){
        let email = req.params.email;
        res.render('verify', {email});
    });

    app.get('/sendemailagain/:email', function(req, res){
        let useremail = req.params.email;
        console.log(useremail);
        db.collection('users').findOne({email: useremail}).then(result => {
            email(useremail, 'signup', {id:result._id});
            res.redirect('/verifyemail/' + useremail);
        });
      
    });

    app.get('/logout/:email', function(req, res){
        let email = req.params.email;
        db.collection('users').findOne({email: email}).then(profile => {
            database.updateOne('users', {email: email}, {loggedin: false});
            res.redirect('/login');
        });
    });

    app.get('/verifyloggedin/:email', function(req, res){
        let email = req.params.email;

        db.collection('users').findOne({email: email}).then(profile => {
            console.log(profile);
            res.json({loggedin: profile.loggedin});
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
                
                let data = req.body;
            
                if(response.email === true && response.index === true && data.isCorrect === true){
                    let user = {
                    name: data.name,
                    index: data.index,
                    email: data.email,
                    birthday: data.birthday,
                    gender: data.gender,
                    phone: data.phone,
                    password: data.password,
                    type: data.type,
                    faculty: data.faculty,
                    department: data.department,
                    verified: false,
                    loggedin: false
                    };
                    let id = database.addUser(user);
                    mail(req.body.email, 'signup', {id: id});
                }
                res.json(response);
            });
        });
        
    });


}