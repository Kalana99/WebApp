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

module.exports.checkEmailExistence = (req, res) => {
    let email = req.body.email;

    db.collection('users').findOne({email: email}).then(user => {
        if(user)
            res.json({emailExists: true});
        else
            res.json({emailExists: false});
    });

};

module.exports.checkEmailAndPassword = (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    //get user with the email
    User.findOne({email: email}).then(user => {

        if(user == null){
            res.json({emailExists: false});
        }
        else{
            let data;
            data.emailExists = true;
            if(password != null){
                User.checkPassword(user._id, password).then(confirmedUser => {
                    data.passwordCorrect = confirmedUser.passwordCorrect;
                });
            }
            res.json(data);
        }

        
    });
};