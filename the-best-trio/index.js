const express = require('express');
const path = require('path');
const SneaksAPI = require('sneaks-api');
const sneaks = new SneaksAPI();
const app = express();
const PORT = process.env.PORT || 3028;

// Serve all static files (HTML, CSS, JS, images) from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Serve homepage.html for both root and /homepage routes
app.get(['/', '/homepage'], (req, res) => {
    res.sendFile(path.join(__dirname, '../public/homepage.html'));
});

app.get('/shoes', (req, res) => {
    sneaks.getProducts("Nike", 10, function(err, products) {
        if (err) {
            console.error('Error fetching products:', err);
            res.status(500).json({ error: 'Error fetching products' });
        } else {
            res.json(products);
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(3028, () => {
    console.log(`Server is running on port http://localhost:3028`);
});