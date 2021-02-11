const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Creating schema and model
const threadSchema = new Schema({
    "StaffID": String,
    "studentID": String,
    //"date": String,
    //"time": String,
    "type": String,
    "status": String,
    "messageID_list": [String],
    "additionalData": Object,
    "module": String,
    "deletedID": String
},
{ timestamps: true });

const Thread = mongoose.model('Thread', threadSchema);
module.exports = Thread;