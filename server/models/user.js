const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE', 'COMPANY_ROLE'],
    message: '{VALUE} no es un rol válido'
};

let Schema = mongoose.Schema;

let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name must be necessary']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email must be necessary']
    },
    state: {
        type: Boolean,
        default: true
    },
    description: {
        type: String,
        required: false
    },
    telefono: {
        type: String,
        required: false
    },
    score: {
        type: Number,
        required: false
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
        default: {}
    },
    certificates: {
        type: Array,
        default: {}
    },
    img: {
        type: String,
        required: false
    },
    google: {
        type: Boolean,
        default: false
    },
    linkedin: {
        type: Boolean,
        default: false
    },
    facebook: {
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