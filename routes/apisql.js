const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
})
// Get all products from server
router.get('/products', async (req, res) => {
    try {
        const products = await pool.query('SELECT * FROM products');
        res.json(products.rows);
    } catch(err) {
        res.status(500).json({error: 'Database error'})
    }
});

//Get all products sorted ascending
router.get('/products/ascending/:sortType', async(req, res) => {
    try {
        const sortType = req.params.sortType;
        const allowedSort  = ['price', 'name']
        if (!allowedSort.includes(sortType)) {
            return res.status(400).json({ error: 'Invalid sort type' });
        }
        const products = await pool.query(`SELECT * FROM products WHERE ${sortType} IS NOT NULL ORDER BY ${sortType}`)
        res.json(products.rows)
    } catch(err) {
        console.log(err)
        res.status(500).json({error: 'Database error'})
    }
});
//Get all products sorted descending
router.get('/products/descending/:sortType', async(req, res) => {
    try {
        const sortType = req.params.sortType;
        const allowedSort  = ['price', 'name']
        if (!allowedSort.includes(sortType)) {
            return res.status(400).json({ error: 'Invalid sort type' });
        }
        const products = await pool.query(`SELECT * FROM products WHERE ${sortType} IS NOT NULL ORDER BY ${sortType} DESC`)
        res.json(products.rows)
    } catch(err) {
        console.log(err)
        res.status(500).json({error: 'Database error'})
    }
});

// Get single product from server
router.get('/products/:id', async (req, res) => {
    console.log('Testar med id= ', req.params.id);
    try {
        const product = await pool.query('SELECT * FROM products WHERE product_id=$1', [req.params.id]);
        if (product.rows.length ===0){
            return res.status(404).json({ error: 'Product not found'})
        }
        res.json(product.rows[0])
    } catch(err){
        console.log(err)
        res.status(500).json({ error: 'Database error'});
    }
});

//Update product
router.put('/products/:id', async (req, res) => {
    const {name, price, stock} = req.body;
    try {
        const updatedProduct = await pool.query(
            'UPDATE products SET name = $1, price=$2, stock=$3 WHERE id=$4 RETURNING *', [name, price, stock, req.params.id]
        );
        if (updatedProduct.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found'});
        }
        res.json(updatedProduct.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update product'})
    }
});

// Delete product
/*
router.post('/', async (req, res) => {

})
*/

router.get('/orders/:userID', async (req, res) => {
    try {
        const orders = await pool.query(
            'SELECT * FROM orders WHERE userid=$1', [req.params.userID]
        );
        if (orders.rows.length === 0) {
            return res.status(404).json({ error: 'No orders found'})
        }
        res.json(orders.rows)
    } catch(err) {
        res.status(500).json({ error: 'Database error'})
    }
});
//Get orderline info
router.get('/orders/:userID/:order_id', async (req, res) => {
    try {
        const orderlines = await pool.query(
            'SELECT * FROM order_lines WHERE order_id=$1 AND user_id=$2', [req.params.order_id, req.params.userID]
        );
        if (orderlines.rows.length === 0){
            return res.status(404).json({ error: 'No info found for the order'})
        }
        res.json(orderlines.rows)
    } catch(err) {
        res.status(500).json({ error: 'Database error'})
    }
});
//Create a new orderline
router.put('/:order_id', async (req, res)=> {
    const {user, product, amount, price, orderID} = req.body;
    try {
        const newOrderLine = await pool.query(
            'INSERT INTO order_lines (user_id, product_id, amount, price_at_purchase, order_id) VALUES ($1, $2, $3, $4, $5)', [user, product, amount, price, orderID]
        );
    } catch(err) {
        res.status(500).json({ error: 'Database error'})
    }
});
module.exports = router;