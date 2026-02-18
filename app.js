const express = require('express');
const path = require('path');
//require('dotenv').config({ path: path.join(__dirname, '../.env') }); Det här funkar bara om .env ligger i mappen ovanför app.js
//eftersom app.js är direkt i foldern för projektet bör inte .env ligga ovanför då den då inte längre är direkt kopplad till detta
require('dotenv').config();

//This is for the cookies
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const pool = require('./db'); // <-- import pool

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

//session 
app.use(session({
    store: new pgSession({
        pool: pool, // Use the existing pool
        tableName: 'session', // Optional, defaults to 'session'
        createTableIfMissing: true, // Automatically create the session table if it doesn't exist
        pruneSessionInterval: 60 * 60 // Optional: prune expired sessions every hour
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        httpOnly: false,
        maxAge: 24 * 60 * 60 * 1000 // 10 day
     } 
}));



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

//Login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/signup', (req, res) => {
    res.redirect('/signup.html');
});

app.get('/profile', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.sendFile(path.join(__dirname, 'public', 'profile.html'));
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


