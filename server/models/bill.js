const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let billSchema = new Schema({

    benefits: {
        type: Number,
        default: 0
    },
    expenses: {
        type: Number,
        default: 0
    },
    internalProjects: {
        type: Schema.Types.ObjectId,
        ref: 'InternalProjects'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
    }

});

billSchema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;

}

billSchema.plugin(uniqueValidator, { message: '{PATH} must be unique' });

module.exports = mongoose.model('Bill', billSchema);