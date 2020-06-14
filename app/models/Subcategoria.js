const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;
let subCategoriaSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'La descipcion es requerida']
    }
});

categoriaSchema.plugin(uniqueValidator, { message: '{PATH} se encuentra registrado' });
module.exports = mongoose.model('SubCategoria', subCategoriaSchema);