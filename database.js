//Connecting to the database
let mongoose = require('mongoose');
const User = require('./models/User');
const Thread = require('./models/Thread');
const Message = require('./models/Message');

mongoose.Promise = global.Promise;
mongoose.connect("mongodb+srv://akash:1234@nodetuts.wxb9o.mongodb.net/StudentRequestSystem?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;

let dropCollection = function(collection){
    db.dropCollection(collection, function(){});
};

let updateOne = function(collection, criteria, submission){
    db.collection(collection).updateOne(criteria, {$set: submission});
};

let updateMany = function(collection, criteria, submission){
    db.collection(collection).updateMany(criteria, {$set: submission});
};

let find = function(collection, query){
    return db.collection(collection).find(query);
}

let addUser = function(user){
    let tempUser = new User(user);
    tempUser.save();
    return tempUser._id;
};

let addThread = function(thread){
    let tempThread = new Thread(thread);
    tempThread.save();
    return tempThread._id;
};

let addMessage = function(message){
    let tempMessage = new Message(message);
    tempMessage.save();
    return tempMessage._id;
}

let addFile = function(file){
    db.collection('files').insertOne(file, (err) => {
        if (err){
            console.log(err);
        }else{
            console.log("file inserted");
        }
    });
}


let functions = {
    dropCollection: dropCollection,
    updateOne: updateOne,
    updateMany: updateMany,
    find: find,
    addUser: addUser,
    addThread: addThread,
    addMessage: addMessage,
    addFile: addFile
};

module.exports = functions;