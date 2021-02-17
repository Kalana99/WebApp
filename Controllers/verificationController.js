const email = require('../modules/email');
const mongoose = require('mongoose');
const db = mongoose.connection;

module.exports.verifyId_get = (req, res) => {
    let s_id = req.params.id;
    let o_id = new mongoose.Types.ObjectId(s_id);
    mongoose.connection.collections.users.updateOne({_id: o_id }, {$set: {verified: true}});
    res.render('verified');
};

module.exports.verifyEmail_get = (req, res) => {
    let id = req.params.id;
    db.collections.users.findOne({_id: mongoose.Types.ObjectId(id)}).then(profile => {
        res.render('verify', {email, id});
    });
    
};

module.exports.sendEmailAgain_get = (req, res) => {
    let id = req.params.id;
    
    db.collections.users.findOne({_id: mongoose.Types.ObjectId(id)}).then(result => {
        email(result.email, 'signup', {id:id});
        res.redirect('/verifyemail/' + id);
    });
};