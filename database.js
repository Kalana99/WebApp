//Connecting to the database
let mongoose = require('mongoose');
const User = require('./models/User');
const Thread = require('./models/Thread');

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


let functions = {
    dropCollection: dropCollection,
    updateOne: updateOne,
    updateMany: updateMany,
    find: find,
    addUser: addUser,
    addThread: addThread
};

module.exports = functions;