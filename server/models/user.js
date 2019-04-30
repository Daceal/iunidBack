const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE', 'COMPANY_ROLE', 'EDITOR_ROLE'],
    message: '{VALUE} is not a valid role'
};

let Schema = mongoose.Schema;

let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name must be necessary']
    },
    email: {
        type: String,
        required: [true, 'Email must be necessary']
    },
    state: {
        type: Boolean,
        default: true
    },
    description: {
        type: String
    },
    phone: {
        type: String
    },
    score: {
        type: Array,
        default: []
    },
    password: {
        type: String,
        required: [true, 'Password must be necessary']
    },
    skills: {
        type: Array,
        default: []
    },
    courses: {
        type: Array,
        default: []
    },
    certificates: {
        type: Array,
        default: []
    },
    img: {
        type: String
    },
    google: {
        type: Boolean,
        default: false
    },
    userType: {
        type: String,
        default: 'USER_ROLE',
        enum: validRoles
    }

});

userSchema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;

}

userSchema.plugin(uniqueValidator, { message: '{PATH} must be unique' });

module.exports = mongoose.model('User', userSchema);