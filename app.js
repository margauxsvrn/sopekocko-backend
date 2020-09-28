const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config()

// const stuffRoutes = require('./routes/stuff');
// const userRoutes = require('./routes/user');


// Je connecte la base de donnée MongoDB 

mongoose.connect('mongodb+srv://' + process.env.DB_USER + ':' + process.env.DB_PASSWORD + '@' + process.env.DB_LINK + '/<dbname>?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échoué !'));


// Je donne l'autorisation à tout le monde d'accéder à l'API

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // accéder à notre API depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // ajouter les headers mentionnés aux requêtes envoyées vers notre API
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // envoyer des requêtes avec les méthodes mentionnées
    next();
});


// Je défini la fonction json comme middleware global pour l'application

app.use(bodyParser.json());


// J'enregistre le routeur pour toutes les demandes faites vers /api/stuff

// app.use('/api/stuff', stuffRoutes);
// app.use('/api/auth', userRoutes);



module.exports = app;