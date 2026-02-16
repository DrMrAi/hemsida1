const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');
// Allt det här var för att läsa in data för en lokal CSV fil
const csvFilePath = path.join(__dirname, '../data/sorted_by_name.csv');

// GET all products
router.get('/products', (req, res) => {
    fs.readFile(csvFilePath, 'utf8', (err, csvData) => {
        if (err) return res.status(500).json({ error: "Failed to read CSV" });

        const parsed = Papa.parse(csvData, { header: true, skipEmptyLines: true });
        res.json(parsed.data);
    });
});

// GET single product by productId
router.get('/products/:id', (req, res) => {
    fs.readFile(csvFilePath, 'utf8', (err, csvData) => {
        if (err) return res.status(500).json({ error: "Failed to read CSV" });

        const parsed = Papa.parse(csvData, { header: true, skipEmptyLines: true });
        const product = parsed.data.find(p => p.productId === req.params.id);
        if (!product) return res.status(404).json({ error: "Product not found" });

        res.json(product);
    });
});



module.exports = router;
