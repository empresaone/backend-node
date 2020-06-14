const mongoose = require('mongoose');

let Schema = mongoose.Schema;
let postSchema = new Schema({

    title: {
        type: String,
        require: [true, 'El titulo es requerido']
    },
    detail: {
        type: String,
        require: false
    },
    status: {
        type: Boolean,
        default: true
    },
    price: {
        type: Number,
        default: 0
    },
    creation: {
        type: Date,
        default: new Date()
    },
    renovation: {
        type: Date,
        require: false
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria'
    },
    subCategoria: {
        type: Schema.Types.ObjectId,
        ref: 'SubCategoria'
    }
});

module.exports = mongoose.model('Post', postSchema);