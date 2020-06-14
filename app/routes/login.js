const express = require('express');
const app = express();
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.post('/login', (req, res) => {

    let body = req.body;
    Usuario.findOne({ email: body.email }, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err: err,
                message: 'Error al intentar recuperar el registro'
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                err: err,
                message: 'Usuario o password inválido'
            });
        }

        if (!bcrypt.compareSync(body.password, usuario.password)) {
            return res.status(400).json({
                ok: false,
                err: err,
                message: 'Usuario o password inválido'
            });
        }

        let token = jwt.sign({
            usuario: usuario
        }, process.env.SEED, {
            expiresIn: process.env.EXPIRE
        });

        res.json({
            usuario: usuario,
            token: token
        });
    });
});

module.exports = app;