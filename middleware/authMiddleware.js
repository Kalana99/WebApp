const jwt = require('jsonwebtoken');

let requireAuth = (req, res, next) => {

    const token = req.cookies.jwt;

    //check whether jwt exists and it is verified
    if(token){
        jwt.verify(token, 'esghsierhgoisio43jh5294utjgft*/*/4t*4et490wujt4*/w4t*/t4', (err, decodedToken) => {
            if(err){
                console.log(err.message);
                res.redirect('/login');
            }
            else{
                next();
            }
        });
    }
    else{
        console.log('not token');
        res.redirect('/login');
    }

};

module.exports = {requireAuth};