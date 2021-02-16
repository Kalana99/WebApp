const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Creating schema and model
const messageSchema = new Schema({
    "from": String,
    "text": String,
    "files": [String]
},
{ timestamps: true });

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;