const express = require('express');
const app = express();
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');

app.get('/usuario', (req, res) => {
    res.json('Hola mundo desde la app');
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

app.post('/usuario', (req, res) => {
    res.json('Hola mundo desde la app');
});

app.put('/usuario', (req, res) => {
    res.json('Hola mundo desde la app');
});

app.delete('/usuario', (req, res) => {
    res.json('Hola mundo desde la app');
});

module.exports = app;