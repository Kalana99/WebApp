//Connecting to the database
let mongoose = require('mongoose');
let db = mongoose.connection;
const User = require('./models/User');
const Thread = require('./models/Thread');
const Message = require('./models/Message');
const fs = require('fs');

mongoose.Promise = global.Promise;

let addUser = function(user){
    let tempUser = new User(user);
    tempUser.save();
    return tempUser._id;
}

let addThread = function(thread){
    let tempThread = new Thread(thread);
    tempThread.save();
    return tempThread._id;
}

let addMessage = function(message){
    let tempMessage = new Message(message);
    tempMessage.save();
    return tempMessage._id;
}

let deleteMessage = async function(messageId){

    let message = await db.collections.messages.findOne({_id: mongoose.Types.ObjectId(messageId)});
    let files = message.files;

    for(let i = 0; i < files.length; i++){
        fs.unlink('uploads/' + files[i], (err) => {});
    }


    db.collections.messages.findOneAndDelete({_id: mongoose.Types.ObjectId(messageId)});
}

let deleteThread = async function(threadId){

    let thread = await db.collections.threads.findOne({_id: mongoose.Types.ObjectId(threadId)});

    for(let i = 0; i < thread.messageID_list.length; i++){
        deleteMessage(thread.messageID_list[i]);
    }

    db.collections.threads.deleteOne({_id: mongoose.Types.ObjectId(threadId)});

}

let deleteUser = async function(userId){
    db.collections.users.deleteOne({_id: mongoose.Types.ObjectId(userId)});
}

let functions = {
    addUser,
    addThread,
    addMessage,
    deleteMessage,
    deleteThread,
    deleteUser
};

module.exports = functions;