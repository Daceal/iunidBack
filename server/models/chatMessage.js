const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let chatMessageSchema = new Schema({

    email: {
        type: String,
        required: true
    },
    idConversation: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    state: {
        type: Boolean,
        default: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('ChatMessage', chatMessageSchema);