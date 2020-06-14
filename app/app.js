require('./config/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(require('./routes/usuarioroutes'));

mongoose.connect(process.env.URI_BD, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log('Base de datos on-line');
});

app.listen(process.env.PORT, () => {
    console.log(`App escuchando por el puerto ${process.env.PORT}`);
});