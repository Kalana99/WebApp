const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

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
    "department": String,
    "verified": Boolean,
    "loggedin": Boolean
});

userSchema.pre('save', async function(next){

    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);

    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
