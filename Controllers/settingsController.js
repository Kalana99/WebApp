const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Message = require('../models/Message');
let database = require('../database');

const mongoose = require('mongoose');
const db = mongoose.connection;
const Thread = require('../models/Thread');

//settings option - edit profile
module.exports.get_editProfile = (req, res) => {
    res.render('EditProfile');
};

module.exports.put_editProfile = (req, res) => {

    if (JSON.stringify(req.body) === JSON.stringify({})){
        console.log("cannot find any data to change");
        res.json({});
    }
    else{
        const token = req.cookies.jwt;

        jwt.verify(token, 'esghsierhgoisio43jh5294utjgft*/*/4t*4et490wujt4*/w4t*/t4', (err, decodedToken) => {
            let id = decodedToken.id;

            db.collections.users.findOneAndUpdate({_id: mongoose.Types.ObjectId(id)},
            {$set: req.body}, function(err){
                if(err){
                    console.log(err);
                }
                else{
                    console.log("user data changed");
                    res.json({});
                }
            })
        });
    }
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
            db.collections.users.findOneAndUpdate({_id: mongoose.Types.ObjectId(id)}, 
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

let fs = require('fs');

module.exports.let_deleteAccount = (req, res) => {
    
    const token = req.cookies.jwt;

    jwt.verify(token, 'esghsierhgoisio43jh5294utjgft*/*/4t*4et490wujt4*/w4t*/t4', async (err, decodedToken) => {
        let id = decodedToken.id;

        let user = (await db.collections.users.findOneAndUpdate({_id: mongoose.Types.ObjectId(id)}, {$set: {email: "", index: ""}}, {useFindAndModify: false})).value;

        if (user.type === "student"){
            console.log('deleting student');
            await db.collections.threads.updateMany({studentID: id}, {$set: {deletedID: id, studentID: null}});
        }
        else{
            console.log('deleting staff');
            await db.collections.threads.updateMany({StaffID: id}, {$set: {deletedID: id, StaffID: null}})
        }

        let deleteThreads = await db.collections.threads.find({StaffID: null, studentID: null}).toArray();
        console.log('delete threads', deleteThreads);

        for(let i = 0; i < deleteThreads.length; i++){

            database.deleteThread(deleteThreads[i]._id);

        }

        db.collections.threads.deleteMany({StaffID: null, studentID: null}).then((obj) =>{
            res.json({});
        });

    });
};