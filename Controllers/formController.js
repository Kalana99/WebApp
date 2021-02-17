const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const db = mongoose.connection;

const maxAge = 1 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({id}, 'esghsierhgoisio43jh5294utjgft*/*/4t*4et490wujt4*/w4t*/t4', {
        expiresIn: maxAge
    });
};

module.exports.checkEmailExistence = (req, res) => {
    let email = req.body.email;

    db.collections.users.findOne({email: email}).then(user => {
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
    db.collections.users.findOne({email: email}).then(user => {

        if(user == null){
            res.json({emailExists: false});
        }
        else{
            let data = {};
            data.emailExists = true;
            if(password != null){
                User.checkPassword(user._id, password).then(confirmedUser => {
                    data['passwordCorrect'] = confirmedUser.passwordCorrect;
                    data['verified'] = confirmedUser.verified;
                    res.json(data);
                });
            }
            
        }

        
    });
};

module.exports.checkIndexExistence = (req, res) => {

    let index = req.body.index;

    db.collections.users.findOne({index: index}).then(user => {
        data = {indexExists: true}

        if(user == null)
            data['indexExists'] = false;

        res.json(data);

    });


};

module.exports.checkPassword = (req, res) => {

    const token = req.cookies.jwt;
    const password = req.body.password;

    jwt.verify(token, 'esghsierhgoisio43jh5294utjgft*/*/4t*4et490wujt4*/w4t*/t4', (err, decodedToken) => {
        let id = decodedToken.id;
        
        User.checkPassword(id, password).then(user => {
            res.json({passwordCorrect: user.passwordCorrect});
        });

    });

};