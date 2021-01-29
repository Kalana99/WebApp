const User = require('../models/User');
const database = require('../database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let mongoose = require('mongoose');
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

        User.checkPassword(id, req.body.current_password).then(profile => {//user model method
            if(profile.passwordCorrect === false){
                res.json({fault: 'current_password'});
            }
            else{//for validation
    
                if(req.body.new_password === null){
                    res.json({fault: 'new_password'});
                }
                else if(req.body.confirm_password === null){
                    res.json({fault: 'confirm_password'});
                }
                else if(req.body.new_password != req.body.confirm_password){
                    res.json({fault: 'unmatched'});
                }
                else{
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
                                res.redirect('/userprofile')
                            }
                        });
                    })

                    
                }
            }
        });
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

        User.login(req.body.email, req.body.password).then(profile => {//user model method
            if(profile === null){
                res.json({fault: 'email'});
            }
            else if(profile.passwordCorrect === false){
                res.json({fault: 'password'});
            }
            else if (!req.body.confirmation){
                res.redirect('/userprofile')
            }
            else{
                db.collection('users').deleteOne({_id: mongoose.Types.ObjectId(id)})
                .then(function(d){
                    console.log(d.deletedCount);
                    //res.redirect('/login')
                    res.json({'message': 'account deletion successful'});
                });
            }
        });
    });
};