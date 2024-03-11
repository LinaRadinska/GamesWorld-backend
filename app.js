const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config(); // Load environment variables
const app = express();
const port = 5000;

require('./models/game');
require('./models/review');
require('./models/user');
require('./models/feature');
require('./models/genre');

const gamesRoutes = require('./routes/games-routes');

// Define your routes and middleware here

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accespt, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
});

app.use('/api/games', gamesRoutes);

app.use((error, req, res, next) => {
    res.status(error.code || 500);
    res.json({message: error.message || 'An unknown error occurred'});
});

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        app.listen(process.env.PORT || port);
    }).catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
    });