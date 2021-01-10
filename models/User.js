const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Creating schema and model
const userSchema = new Schema({
    "name": String,
    "index":String,
    "email": String,
    "birthday": String,
    "gender": String,
    "phone": String,
    "password": String,
    "type": String,
    "faculty": String,
    "department": String
});

const User = mongoose.model('User', userSchema);
module.exports = User;
