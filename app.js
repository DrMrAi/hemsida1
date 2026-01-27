// app.js
const express = require('express');
const app = express();
const port = 3000;

// Serve static files from 'public' folder
app.use(express.static('public'));

// Basic route
app.get('/', (req, res) => {
  res.send('<h1>Welcome to my Node.js website!</h1>');
});

app.get('/productexample', (req, res) => {
  res.send('<h1>Welcome to my Node.js website!</h1>');
});
// Start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
