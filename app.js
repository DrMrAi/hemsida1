const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Serve static files (CSS, images, JS)
app.use(express.static('public'));

// Mount API routes
const apiCsv = require('./routes/apicsv');
app.use('/api', apiCsv);

// Dynamic product page
app.get('/product/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'product.html'));
});

// Homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/test', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
