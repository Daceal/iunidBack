const mongoose = require('mongoose');
//const Usuario = mongoose.model('Usuario');
const uniqueValidator = require('mongoose-unique-validator');

let projectStates = {
    values: ['Open', 'In progress', 'Close'],
    message: '{VALUE} is not a valid state'
};

let validCategory = {
    values: ['computer_science', 'physics', 'graphic_design', 'design', 'architecture', 'other'],
    message: '{VALUE} is not a valid category'
};

let Schema = mongoose.Schema;

let internalProjectSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    tags: {
        type: Array,
        default: []
    },
    files: {
        type: Array,
        default: []
    },
    maxPrice: {
        type: Number,
        default: 0
    },
    minPrice: {
        type: Number,
        default: 0
    },
    deliveryDate: {
        type: Date,
        required: true
    },
    counteroffer: {
        type: Boolean,
        default: false
    },
    state: {
        type: String,
        default: 'Open',
        enum: projectStates
    },
    initialDate: {
        type: Date,
        required: true
    },
    delivery: {
        type: Array,
        default: {}
    },
    userOwner: {
        type: String,
        required: true
    },
    users: {
        type: Array,
        default: []
    },
    category: {
        type: String,
        required: true,
        enum: validCategory
    },
    pendingAccepts: {
        type: Array
    }
});


module.exports = mongoose.model('InternalProject', internalProjectSchema);