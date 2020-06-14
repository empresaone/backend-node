const express = require('express');
const app = express();
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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


async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    console.log(payload.name);
    console.log(payload.email);
    console.log(payload.picture);

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async(req, res) => {

    let token = req.body.idtoken;
    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            });
        });

    Usuario.findOne({ email: googleUser.email }, (err, usuarioBD) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }

        if (usuarioBD) {
            if (usuarioBD.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe ingresar mediante el formulario de login'
                    }
                });
            } else {
                let token = jwt.sign({
                    usuario: usuarioBD
                }, process.env.SEED, {
                    expiresIn: process.env.EXPIRE
                });

                return res.status(200).json({
                    ok: true,
                    usuario: usuarioBD,
                    token: token
                });
            }
        } else {

            let usuario = new Usuario();
            usuario.name = googleUser.name;
            usuario.email = googleUser.email;
            usuario.image = googleUser.img;
            usuario.google = true;
            usuario.password = '**';

            usuario.save((err, usuarioBD) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err: err
                    });
                }

                let token = jwt.sign({
                    usuario: usuarioBD
                }, process.env.SEED, {
                    expiresIn: process.env.CADUCIDAD_TOKEN
                });

                return res.status(200).json({
                    ok: true,
                    usuario: usuarioBD,
                    token: token
                });
            });
        }
    })
});

module.exports = app;