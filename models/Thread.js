const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Creating schema and model
const threadSchema = new Schema({
    "topic": String,
    "StaffID": String,
    "studentID": String,
    //"date": String,
    //"time": String,
    "type": String,
    "status": Boolean,
    "messageID_list": [String],
    "additionalData": Object,
    "module": String
},
{ timestamps: true });

const Thread = mongoose.model('Thread', threadSchema);
module.exports = Thread;