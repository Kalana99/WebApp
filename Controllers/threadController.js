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

module.exports.submitRequests_post = (req, res) => {
    
    const token = req.cookies.jwt;

    jwt.verify(token, 'esghsierhgoisio43jh5294utjgft*/*/4t*4et490wujt4*/w4t*/t4', (err, decodedToken) => {
        let id = decodedToken.id;

        let data = req.body;
        data['studentID'] = id;

        let message = data.message;
        delete data.message;
        let messageId = database.addMessage({'from': id, 'text': message});
        data['messageID_list'] = [messageId];

        database.addThread(data);
        res.json({});
    });

};

module.exports.getThreadData_get = (req, res) => {

    const token = req.cookies.jwt;

    jwt.verify(token, 'esghsierhgoisio43jh5294utjgft*/*/4t*4et490wujt4*/w4t*/t4', (err, decodedToken) => {
        let id = decodedToken.id;

        db.collection('users').findOne({_id: mongoose.Types.ObjectId(id)}).then(user => {
            
            db.collection('threads').find({$or:[{"studentID": id}, {'StaffID': id}]}).toArray().then(array => {

                let  addNameToArray = async () => {

                    for(let i = 0; i < array.length; i++){
                        if(user.type === 'student'){
                            let staffUser = await db.collection('users').findOne({_id: mongoose.Types.ObjectId(array[i].StaffID)});
                            if (!staffUser){
                                staffUser = await db.collection('users').findOne({_id: mongoose.Types.ObjectId(array[i].deletedID)});
                            }
                            array[i].name = staffUser.name;
                        }
                        else if(user.type === 'staff'){
                            let studentUser = await db.collection('users').findOne({_id: mongoose.Types.ObjectId(array[i].studentID)});
                            if (!studentUser){
                                studentUser = await db.collection('users').findOne({_id: mongoose.Types.ObjectId(array[i].deletedID)});
                            }
                            array[i].name = studentUser.name;
                        }
                    }

                    res.json(array);
                };

                addNameToArray();

            });

        });
    });
};

module.exports.getMessages_post = (req, res) => {

    let threadId = req.body.threadId;

    let getData = async () => {

        let thread = await db.collection('threads').findOne({_id: mongoose.Types.ObjectId(threadId)});

        let messageIdList = thread.messageID_list;
        
            messages = []

            messageIdList.forEach((element) => {
                
                
            });

            for(let i = 0; i < messageIdList.length; i++){
                let message = await db.collection('messages').findOne({_id: mongoose.Types.ObjectId(messageIdList[i])});
                messages.push(message);
            }

            res.json({messages});
    
    };
    getData();

    

};

module.exports.reply_post = (req, res) => {

    const token = req.cookies.jwt;

    jwt.verify(token, 'esghsierhgoisio43jh5294utjgft*/*/4t*4et490wujt4*/w4t*/t4', (err, decodedToken) => {
        let id = decodedToken.id;

        db.collection('users').findOne({_id: mongoose.Types.ObjectId(id)}).then(user => {
            
            let messageId = database.addMessage({
                "from": id,
                "text": req.body.text,
            });

            db.collection('threads').updateOne({_id: mongoose.Types.ObjectId(req.body.threadId)}, {$push: {messageID_list: messageId.toString()}});
            res.json({});
        });
    });
    
};

module.exports.acceptOrDeclineRequest_post = (req, res) => {
    data = req.body;
    console.log(data);

    database.updateOne('threads', {_id: mongoose.Types.ObjectId(data.threadId)}, {status: data.status});

    res.json({'status': 'success'});
};

module.exports.getUserType_get = (req, res) => {
    const token = req.cookies.jwt;

    jwt.verify(token, 'esghsierhgoisio43jh5294utjgft*/*/4t*4et490wujt4*/w4t*/t4', (err, decodedToken) => {
        let id = decodedToken.id;

        db.collection('users').findOne({_id: mongoose.Types.ObjectId(id)}).then(user => {
            
            res.json({type: user.type});

        });
    });
};

module.exports.getStaff_post = (req, res) => {
    let searchTerm = req.body.input;

    db.collection('users').find({type: 'staff'}).toArray().then(lecturers => {

        let suggestions = lecturers.filter((lecturer) => {
            return lecturer.name.toLowerCase().includes(searchTerm);
        });

        let result = [];

        suggestions.forEach(lecturer => {
            result.push({name: lecturer.name, id: lecturer._id, index: lecturer.index});
        });

        res.json({lecturers:result, time: req.body.time});
    });

    
};