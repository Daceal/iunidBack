const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE', 'COMPANY_ROLE', 'EDITOR_ROLE'],
    message: '{VALUE} no es un rol válido'
};


let Schema = mongoose.Schema;

let adminSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Email must be necessary']
    },
    password: {
        type: String,
        required: [true, 'Password must be necessary']
    },
    userType: {
        type: String,
        default: 'ADMIN_ROLE',
        enum: validRoles
    }
});

adminSchema.methods.toJSON = function() {

    let admin = this;
    let adminObject = admin.toObject();
    delete adminObject.password;

    return adminObject;

}

adminSchema.plugin(uniqueValidator, { message: '{PATH} must be unique' });

module.exports = mongoose.model('Admin', adminSchema);