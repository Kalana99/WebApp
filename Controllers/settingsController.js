const User = require('../models/User');
const database = require('../database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let mongoose = require('mongoose');
const { updateMany } = require('../models/User');
const db = mongoose.connection;
mongoose.Promise = global.Promise;
mongoose.connect("mongodb+srv://akash:1234@nodetuts.wxb9o.mongodb.net/StudentRequestSystem?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});

//settings option - edit profile
module.exports.get_editProfile = (req, res) => {
    res.render('edit_profile');
};

//settings option - change password
module.exports.get_changePassword = (req, res) => {
    res.render('change_password');
};

module.exports.put_changePassword = (req, res) => {//coppied from authController

    const token = req.cookies.jwt;

    jwt.verify(token, 'esghsierhgoisio43jh5294utjgft*/*/4t*4et490wujt4*/w4t*/t4', (err, decodedToken) => {
        let id = decodedToken.id;

        let password_encrypt = async function(){

            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(req.body.new_password, salt);
            return hashedPassword;
        }

        password_encrypt()
        .then((hashedPassword) => {
            db.collection('users').findOneAndUpdate({_id: mongoose.Types.ObjectId(id)}, 
            {$set: {password: hashedPassword}}, function(err){
                if (err){
                    console.log(err);
                }
                else{
                    console.log('password updated');
                    res.json({});
                }
            });
        })
    });
};

//settings option - delete account
module.exports.get_deleteAccount = (req, res) => {
    res.render('delete_account');
};

module.exports.let_deleteAccount = (req, res) => {
    
    const token = req.cookies.jwt;

    jwt.verify(token, 'esghsierhgoisio43jh5294utjgft*/*/4t*4et490wujt4*/w4t*/t4', (err, decodedToken) => {
        let id = decodedToken.id;

        User.deleteOne({_id: mongoose.Types.ObjectId(id)})
        .then(function(d){
            console.log(d.deletedCount);
            res.json({});
        });

    });
};