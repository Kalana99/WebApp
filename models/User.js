const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Creating schema and model
const userSchema = new Schema({
    "index":String,
    "name": String,
    "email": String,
    "password": String,
    "type": String,
    "faculty": String,
    "department": String,
    "gender": String,
    "telephone": String
});

const User = mongoose.model('User', userSchema);
module.exports = User;
