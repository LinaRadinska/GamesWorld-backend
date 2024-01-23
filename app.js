const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config(); // Load environment variables
const app = express();
const port = 5000;

const gamesRoutes = require('./routes/games-routes');

// Define your routes and middleware here

app.use('/api/games', gamesRoutes);

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        app.listen(process.env.PORT || port);
    }).catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
    });