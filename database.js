//Connecting to the database
let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/testaroo", {useNewUrlParser: true, useUnifiedTopology: true});
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


let functions = {
    dropCollection: dropCollection,
    updateOne: updateOne,
    updateMany: updateMany,
    find: find
};

module.exports = functions;