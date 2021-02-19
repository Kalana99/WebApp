const jwt = require('jsonwebtoken');
const database = require('../database');
const mail = require('../modules/email');
const mongoose = require('mongoose');
const db = mongoose.connection;

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
    
    //Save the incoming user object to the database
    let id = database.addUser(req.body);
    mail(req.body.email, 'signup', {id: id});
    res.json({id});

};

module.exports.login_get = (req, res) => {
    res.render('login');
};

module.exports.login_post = (req, res) => {
    db.collections.users.findOne({email: req.body.email}).then(profile => {
        let token = createToken(profile._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});
        res.json({});
    })
};

module.exports.forgotPassword_get = (req, res) => {
    res.render('forgotPassword');
}

module.exports.forgotPassword_post = (req, res) => {
    // console.log(req.body);

    let states = {};

    states['emailExists']    = null;
    states['questionState'] = null;
    states['answerState']   = null;

    db.collections.users.findOne({email: req.body.email}).then(user => {
        
        if(user){
            states['emailExists'] = true;
            if(user.question === req.body.question){
                states['questionState'] = true;
                if(user.answer === req.body.answer){
                    states['answerState'] = true;
                }
                else{
                    states['answerState'] = false;
                }
            }
            else{
                states['questionState'] = false;
            }
        }
        else{
            states['emailExists'] = false;
        }
        res.json(states);
    });
}

module.exports.ForgotPassword_change_get = (req, res) => {
    res.render('ForgotPassword_change');
}

module.exports.userprofile_get = (req, res) => {

    const token = req.cookies.jwt;

    jwt.verify(token, 'esghsierhgoisio43jh5294utjgft*/*/4t*4et490wujt4*/w4t*/t4', (err, decodedToken) => {
        let id = decodedToken.id;

        db.collections.users.findOne({_id: mongoose.Types.ObjectId(id)}).then(user => {
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

module.exports.getUserId_get = (req, res) => {
    const token = req.cookies.jwt;

    jwt.verify(token, 'esghsierhgoisio43jh5294utjgft*/*/4t*4et490wujt4*/w4t*/t4', (err, decodedToken) => {
        let id = decodedToken.id;

        res.json({id});
    });

};