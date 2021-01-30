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
    
    //an object will come here
    //simply save it to the database

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
                res.json({fault: 'verify', id: profile._id});
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
    res.render('threadView');
};