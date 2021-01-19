const jwt = require('jsonwebtoken');


const maxAge = 1 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({id}, 'esghsierhgoisio43jh5294utjgft*/*/4t*4et490wujt4*/w4t*/t4', {
        expiresIn: maxAge
    });
};

module.exports.signup_get = (req, res) => {
    res.render('SignUp');
};

module.exports.signup_post = (req, res) => {
    res.render('SignUp');
};

module.exports.login_get = (req, res) => {
    res.render('login');
};

module.exports.login_post = (req, res) => {
    db.collection('users').findOne({email: req.body.email}).then(profile => {
        if(profile === null){
            res.json({fault: 'email'});
        }
        else{
            if(req.body.password != profile.password){
                res.json({fault: 'password'});
            }
            else if(profile.verified === false){
                res.json({fault: 'verify'});
            }
            else{
                res.json({fault: 'none'});
                console.log(profile._id);
            }
        }
    });
};