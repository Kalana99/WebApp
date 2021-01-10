//Connecting to the database
let mongoose = require('mongoose');
const User = require('./models/User');
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/StudentRequestSystemDatabase", {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;

let dropCollection = function(collection){
    db.dropCollection(collection, function(){});
};

let updateOne = function(collection, criteria, submission){
    db.collection(collection).users.updateOne(criteria, {$set: submission});
};

let updateMany = function(collection, criteria, submission){
    db.collection(collection).users.updateMany(criteria, {$set: submission});
};

let find = function(collection, query){
    return db.collection(collection).find(query);
}

let addUser = function(user){
    let tempUser = new User(user);
    tempUser.save();
};


let functions = {
    dropCollection: dropCollection,
    updateOne: updateOne,
    updateMany: updateMany,
    find: find,
    addUser: addUser
};

module.exports = functions;