const express = require('express');
const app = express();
const Post = require('../models/Post');
const { verificaToken } = require('../middleware/autentication');

app.get('/post', verificaToken, (req, res) => {
    Post.find()
        .populate('usuario', 'name email status')
        .exec((err, post) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: err,
                    message: 'Error al intentar recuperar los registro'
                });
            }

            Post.count((err, cantidad) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err: err,
                        message: 'Error al intentar contar los registro'
                    });
                }
                res.json({
                    post: post,
                    ok: true,
                    cantidad: cantidad
                });
            });
        });
});

app.post('/post', verificaToken, (req, res) => {

    let body = req.body;
    let post = new Post({
        title: body.title,
        detail: body.detail,
        price: body.price,
        usuario: req.usuario._id
    });

    post.save((err, post) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err,
                message: 'Error al intentar almacenar el registro'
            });
        }

        res.status(200).json({
            post: post,
            ok: true,
            message: 'Registro almacenado satisfactoriamente'

        });
    });
});

module.exports = app;