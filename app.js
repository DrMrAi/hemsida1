// app.js
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files (CSS, images, JS)
app.use(express.static('public'));

// Dynamic product route
app.get('/product/:id', (req, res) => {
  const productId = req.params.id;   // 88833 from URL
  console.log("Requested product:", productId);

  // Send product page HTML
  res.sendFile(path.join(__dirname, 'public', 'product.html'));
});

// Test route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
