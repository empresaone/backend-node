const express = require('express');
const app = express();
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore');
let { verificaToken, veificaAdminRole } = require('../middleware/autentication');

app.get('/usuario', verificaToken, (req, res) => {
    Usuario.find()
        .exec((err, usuarios) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: err,
                    message: 'Error al intentar recuperar los registro'
                });
            }

            Usuario.count((err, cantidad) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err: err,
                        message: 'Error al intentar contar los registro'
                    });
                }
                res.json({
                    usuarios: usuarios,
                    ok: true,
                    cantidad: cantidad
                });
            });
        });
});

app.get('/usuario/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err: err,
                message: 'Error al intentar listar el registro'
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id que introdujo no es válido'
                }
            });
        }

        res.json({
            usuario: usuario,
            ok: true,
        });

    });
});

app.post('/usuario', (req, res) => {

    let body = req.body;
    let usuario = new Usuario({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err,
                message: 'Error al intentar almacenar el registro'
            });
        }

        res.json({
            usuario: usuario,
            ok: true,
            message: 'Registro almacenado satisfactoriamente'
        });
    });
});

app.put('/usuario/:id', [verificaToken, veificaAdminRole], (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'image', 'role', 'status', 'google']);
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err,
                message: 'Error al intentar actualizar el registro'
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id que introdujo no es válido'
                }
            });
        }

        res.json({
            usuario: usuario,
            ok: true,
            message: 'Registro actualizado satisfactoriamente'
        });
    });
});

app.delete('/usuario/:id', [verificaToken, veificaAdminRole], (req, res) => {
    let id = req.params.id;
    Usuario.findOneAndRemove(id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err,
                message: 'Error al intentar eliminar el registro'
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id que introdujo no es válido'
                }
            });
        }

        res.json({
            usuario: usuario,
            ok: true,
            message: 'Registro eliminado satisfactoriamente'
        });
    });
});

module.exports = app;