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
    "verified": Boolean
});

userSchema.pre('save', async function(next){

    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);

    next();
});

userSchema.statics.login = async function(email, password){
    const user = await this.findOne({email: email});

    if(user!= null){
        const auth = await bcrypt.compare(password, user.password);
        if(auth){
            user.passwordCorrect = true;
        }
        else{
            user.passwordCorrect = false;
        }
    }
    return user;
};

userSchema.statics.checkPassword = async function(id, current_password){
    
    const user = await this.findOne({_id: id});
    
    const auth = await bcrypt.compare(current_password, user.password);
    
    if(auth){
        user.passwordCorrect = true;
    }
    else{
        user.passwordCorrect = false;
    }
    
    return user;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
