const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Creating schema and model
const messageSchema = new Schema({
    "from": String,
    "text": String,
    "files": [String]
},
{ timestamps: true });

const removeMessage = (id) => {
    this.remove({_id: mongoose.Types.ObjectId(id)});
}

messageSchema.pre('deleteOne', async (next) => {
    console.log('pre remove hook fired');
    next();
})

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;