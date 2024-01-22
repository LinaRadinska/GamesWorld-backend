const express = require('express');
const app = express();
const port = 5000;

const gamesRoutes = require('./routes/games-routes');

// Define your routes and middleware here

app.use('/api/games', gamesRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});