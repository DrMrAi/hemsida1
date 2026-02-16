const express = require('express');
const path = require('path');
//require('dotenv').config({ path: path.join(__dirname, '../.env') }); Det här funkar bara om .env ligger i mappen ovanför app.js
//eftersom app.js är direkt i foldern för projektet bör inte .env ligga ovanför då den då inte längre är direkt kopplad till detta
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

// Serve static files (CSS, images, JS)
app.use(express.static('public'));

// Mount API routes
const apiCsv = require('./routes/apicsv');
const apiSql = require('./routes/apisql')
//app.use('/api', apiCsv);
app.use('/api', apiSql)

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
