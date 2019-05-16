const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let chatConversationSchema = new Schema({

    owner: {
        type: String,
        required: true
    },
    members: {
        type: Array
    },
    deliveries: {
        type: Array
    },
    state: {
        type: Boolean,
        required: true
    }
});


module.exports = mongoose.model('ChatConversation', chatConversationSchema);