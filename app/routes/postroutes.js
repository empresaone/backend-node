const express = require('express');
const app = express();
const Post = require('../models/Post');
const { verificaToken } = require('../middleware/autentication');

app.get('/post', (req, res) => {
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

app.get('/post/:id', (req, res) => {

    let id = req.params.id;
    Post.findById(id)
        .populate('usuario', 'name email status')
        .exec((err, post) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: err,
                    message: 'Error al intentar listar el registro'
                });
            }

            if (!post) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El id que introdujo no es válido'
                    }
                });
            }

            res.json({
                post: post,
                ok: true,
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

app.put('/post/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;
    Post.findByIdAndUpdate(id, body, { new: true }, (err, post) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err,
                message: 'Error al intentar actualizar el registro'
            });
        }

        if (!post) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id que introdujo no es válido'
                }
            });
        }

        res.json({
            post: post,
            ok: true,
            message: 'Registro actualizado satisfactoriamente'
        });
    });
});


app.delete('/post/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Post.findOneAndRemove(id, (err, post) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err,
                message: 'Error al intentar eliminar el registro'
            });
        }

        if (!post) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id que introdujo no es válido'
                }
            });
        }

        res.json({
            post: post,
            ok: true,
            message: 'Registro eliminado satisfactoriamente'
        });
    });
});

module.exports = app;