const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolValidate = {
    values: ['USER_ROLE', 'ADMIN_ROLE'],
    message: '{VALUE} no es un rol valido'
}

let Schema = mongoose.Schema;
let usuarioSchema = new Schema({

    name: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El apellido es requerido']
    },
    password: {
        type: String,
        required: [true, 'El correo es requerido']
    },
    image: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolValidate
    },
    status: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
});

usuarioSchema.methods.toJSON = function() {
    let usuario = this;
    let usuarioObject = usuario.toObject();
    delete usuarioObject.password;
    return usuarioObject;
}

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} ya se encuentra registado' });
module.exports = mongoose.model('usuario', usuarioSchema);