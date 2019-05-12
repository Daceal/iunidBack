const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE', 'COMPANY_ROLE'],
    message: '{VALUE} no es un rol válido'
};

let Schema = mongoose.Schema;

let companySchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name must be necessary']
    },
    email: {
        type: String,
        required: [true, 'Email must be neccesary']
    },
    contactEmail: {
        type: String
    },
    state: {
        type: Boolean,
        default: true
    },
    description: {
        type: String,
        required: false
    },
    score: {
        type: Array,
        default: [{
            id: 0,
            userVotedEmail: "",
            userScore: 0
        }]
    },
    password: {
        type: String,
        required: [true, 'Password must be necessary']
    },
    img: {
        type: String,
        required: false
    },
    userType: {
        type: String,
        default: 'COMPANY_ROLE',
        enum: validRoles
    },
    cif: {
        type: String,
        required: true,
        unique: true
    },
    contacts: {
        type: Array,
        default: {}
    }

});

companySchema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;

}

companySchema.plugin(uniqueValidator, { message: '{PATH} must be unique' });

module.exports = mongoose.model('Company', companySchema);