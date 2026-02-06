// GET single product by productId
router.get('/products/:id', (req, res) => {
    sql.connection
    fs.readFile(csvFilePath, 'utf8', (err, csvData) => {
        if (err) return res.status(500).json({ error: "Failed to read CSV" });

        const parsed = Papa.parse(csvData, { header: true, skipEmptyLines: true });
        const product = parsed.data.find(p => p.productId === req.params.id);
        if (!product) return res.status(404).json({ error: "Product not found" });

        res.json(product);
    });
});

