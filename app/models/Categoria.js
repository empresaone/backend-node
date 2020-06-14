const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;
let categoriaSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'La descipcion es requerida']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    categoria: [{
        type: Schema.Types.ObjectId,
        ref: 'SubCategoria'
    }]
});

categoriaSchema.plugin(uniqueValidator, { message: '{PATH} se encuentra registrado' });
module.exports = mongoose.model('Categoria', categoriaSchema);