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

    console.log(req.body);
    const token = req.cookies.jwt;

    jwt.verify(token, 'esghsierhgoisio43jh5294utjgft*/*/4t*4et490wujt4*/w4t*/t4', (err, decodedToken) => {
        let id = decodedToken.id;

        db.collections.users.findOneAndUpdate({_id: mongoose.Types.ObjectId(id)},
        {$set: req.body}, function(err){
            if(err){
                console.log(err);
            }
            else{
                console.log("user data changed.");
                res.json({});
            }
        })
    });
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

let deleteUnneededAccounts = async () => {

    //find the user accounts that don't correspond to any remaining threads and delete them

    let users = db.collections.users.find();
    let deleteAccounts = [];

    while(await users.hasNext()){
        let iterateUsers = async (user) => {

            if (user.email === '') {

                let found = false;
                let threads = db.collections.threads.find();

                while(await threads.hasNext()){
                    let iterateThreads = async (thread) => {

                        if (thread.studentID == user._id || thread.StaffID == user._id || thread.deletedID == user._id) {
                            found = true;
                            return false;
                        }
                    };

                    await iterateThreads(await threads.next());
                }

                if (!found) {
                    deleteAccounts.push(mongoose.Types.ObjectId(user._id));
                }
            }

        };

        await iterateUsers(await users.next());
    }

    db.collections.users.deleteMany({_id: {$in: deleteAccounts}});

};

module.exports.let_deleteAccount = (req, res) => {
    
    const token = req.cookies.jwt;

    jwt.verify(token, 'esghsierhgoisio43jh5294utjgft*/*/4t*4et490wujt4*/w4t*/t4', async (err, decodedToken) => {
        let id = decodedToken.id;

        let user = (await db.collections.users.findOneAndUpdate({_id: mongoose.Types.ObjectId(id)}, {$set: {email: "", index: ""}}, {useFindAndModify: false})).value;

        //get if the account is student or staff and make it obsolete
        // by changing the email and the index to empty strings

        if (user.type === "student"){
            await db.collections.threads.updateMany({studentID: id}, {$set: {deletedID: id, studentID: null}});
        }
        else{
            await db.collections.threads.updateMany({StaffID: id}, {$set: {deletedID: id, StaffID: null}})
        }

        //find all the threads of which both the account ids are null, and delete them
        let deleteThreads = await db.collections.threads.find({StaffID: null, studentID: null}).toArray();

        for(let i = 0; i < deleteThreads.length; i++){

            await database.deleteThread(deleteThreads[i]._id);

        }

        //find the user accounts that don't correspond to any remaining threads and delete them
        deleteUnneededAccounts();

        res.json({});

    });
};