const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Creating schema and model
const messageSchema = new Schema({
    "from": String,
    //"date": String,
    //"time": String,
    "text": String,
    "evidanceID": String
},
{ timestamps: true });

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;