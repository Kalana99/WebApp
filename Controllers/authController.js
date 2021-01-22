const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Thread = require('../models/Thread');
const database = require('../database');
const mail = require('../modules/email');

let mongoose = require('mongoose');
const db = mongoose.connection;
mongoose.Promise = global.Promise;
mongoose.connect("mongodb+srv://akash:1234@nodetuts.wxb9o.mongodb.net/StudentRequestSystem?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});

const maxAge = 1 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({id}, 'esghsierhgoisio43jh5294utjgft*/*/4t*4et490wujt4*/w4t*/t4', {
        expiresIn: maxAge
    });
};

module.exports.home_get = (req, res) => {
    res.redirect('/login');
};

module.exports.signup_get = (req, res) => {
    res.render('SignUp');
};

module.exports.signup_post = (req, res) => {
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
                    };
                    let id = database.addUser(user);
                    mail(req.body.email, 'signup', {id: id});
                    response.id = id;
                }
                res.json(response);
            });
        });
};

module.exports.login_get = (req, res) => {
    res.render('login');
};

module.exports.login_post = (req, res) => {
    User.login(req.body.email, req.body.password).then(profile => {
        if(profile === null){
            res.json({fault: 'email'});
        }
        else{

            if(!profile.passwordCorrect){
                res.json({fault: 'password'});
            }
            else if(profile.verified === false){
                res.json({fault: 'verify'});
            }
            else{
                let token = createToken(profile._id);
                res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});
                res.json({fault: 'none'});
            }
        }
    });
};

module.exports.userprofile_get = (req, res) => {

    const token = req.cookies.jwt;

    jwt.verify(token, 'esghsierhgoisio43jh5294utjgft*/*/4t*4et490wujt4*/w4t*/t4', (err, decodedToken) => {
        let id = decodedToken.id;

        db.collection('users').findOne({_id: mongoose.Types.ObjectId(id)}).then(user => {
            res.render('userProfile', user);
        });
    });
        
};

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1});
    res.redirect('/login');
};

module.exports.threads_get = (req, res) => {

    const token = req.cookies.jwt;

    jwt.verify(token, 'esghsierhgoisio43jh5294utjgft*/*/4t*4et490wujt4*/w4t*/t4', (err, decodedToken) => {
        let id = decodedToken.id;

        db.collection('users').findOne({_id: mongoose.Types.ObjectId(id)}).then(user => {
            
            db.collection('threads').find({"studentID": id}).toArray().then(array => {
                console.log(array);
                res.render('threadView', {array});
            });

        });
    });

    
};

module.exports.submitRequests_post = (req, res) => {
    let data = req.body;

    const token = req.cookies.jwt;

    jwt.verify(token, 'esghsierhgoisio43jh5294utjgft*/*/4t*4et490wujt4*/w4t*/t4', (err, decodedToken) => {
        let id = decodedToken.id;

        db.collection('users').findOne({_id: mongoose.Types.ObjectId(id)}).then(user => {
            database.addThread({
                "description": data.description,
                 "studentID": id,
                 "type": data.type
            });
        });
    });

    res.redirect('/userprofile');
};