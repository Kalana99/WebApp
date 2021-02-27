const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
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

    let data = req.body;

    data.type = req.body.type[0];
    
    if(req.body.fileName){
        data['profilePic'] = req.body.fileName[0];
        data['profilePic_uploaded'] = true;
    }
    else{
        data['profilePic_uploaded'] = false;
        data['profilePic'] = "";
    }

    delete data.confirmPsw;
    delete data.fileName;
    
    // Save the user object to the database
    let id = database.addUser(data);
    mail(req.body.email, 'signup', {id: id});
    res.redirect('/verifyemail/' + id);
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

module.exports.forgotPassword_checkPost = (req, res) => {

    let data = {};

    data['emailExists']    = null;

    db.collections.users.findOne({email: req.body.email}).then(user => {
        
        if(user){
            data['emailExists'] = true;
            sentPin = Math.floor(Math.random()*1000000)
            mail(req.body.email, 'forgotPassword', {sentPin: sentPin});
            data['sentPin'] = sentPin;
        }
        else{
            data['emailExists'] = false;
        }
        res.json(data);
    });
}

module.exports.ForgotPassword_change_get = (req, res) => {
    res.render('ForgotPassword_change');
}

module.exports.ForgotPassword_change_put = (req, res) => {

    let password_encrypt = async function(){

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.new_password, salt);
        return hashedPassword;
    }

    password_encrypt()
    .then((hashedPassword) => {
        db.collections.users.findOneAndUpdate({email: req.body.email}, 
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
};

module.exports.userprofile_get = (req, res) => {

    const token = req.cookies.jwt;

    jwt.verify(token, 'esghsierhgoisio43jh5294utjgft*/*/4t*4et490wujt4*/w4t*/t4', (err, decodedToken) => {
        let id = decodedToken.id;

        db.collections.users.findOne({_id: mongoose.Types.ObjectId(id)}).then(user => {
            res.render('userProfile', user);
        });
    });
        
};

module.exports.get_profilePic = (req, res) => {
    const token = req.cookies.jwt;

    jwt.verify(token, 'esghsierhgoisio43jh5294utjgft*/*/4t*4et490wujt4*/w4t*/t4', (err, decodedToken) => {
        let id = decodedToken.id;

        db.collections.users.findOne({_id: mongoose.Types.ObjectId(id)}).then(user => {
            if(user.profilePic_uploaded){
                res.download('profilePics/' + user.profilePic);
            }
            else{
                if(user.gender == 'male'){
                    res.download('profilePics/empty pro pic male.jpg');
                }
                else{
                    res.download('profilePics/empty pro pic female.jpg');
                }
            }
        });
    });
}

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