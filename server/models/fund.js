const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let fundsSchema = new Schema({

    benefits: {
        type: Number,
        default: 0
    },
    expenses: {
        type: Number,
        default: 0
    },
    internalProject: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
});

fundsSchema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;

}

fundsSchema.plugin(uniqueValidator, { message: '{PATH} must be unique' });

module.exports = mongoose.model('Funds', fundsSchema);