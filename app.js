const express = require('express');
const app = express();
const port = 5000; // You can use any port you prefer

// Define your routes and middleware here

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});