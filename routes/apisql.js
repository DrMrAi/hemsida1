const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const crypto = require('crypto')
const pool = require('../db');

function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}


// Get all products from server
router.get('/products', async (req, res) => {
    try {
        const products = await pool.query('SELECT * FROM products LIMIT 100');
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
            'UPDATE products SET name = $1, price=$2, stock=$3 WHERE product_id=$4 RETURNING *', [name, price, stock, req.params.id]
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
    console.log('Fetching orders for user ID:', req.params.userID);
    try {
        const orders = await pool.query(
            'SELECT * FROM orders WHERE user_id=$1 AND status!=$2', [req.params.userID, 'In basket']
        );
        //if (orders.rows.length === 0) {
        //    return res.status(404).json({ error: 'No orders found'})
        //}
        console.log(orders.rows)
        res.json(orders.rows)
    } catch(err) {
        console.log(err)
        res.status(500).json({ error: 'Database error'})
    }
});
//Get orderline info
router.get('/current_order/:userID', async (req, res) => {
    console.log('heeee')
    try {
        const orderlines = await pool.query(
            `SELECT order_lines.amount, products.name, products.price, products.product_id  FROM order_lines 
            INNER JOIN products ON order_lines.product_id = products.product_id WHERE user_id=$1 AND 
            order_id = (SELECT order_id FROM orders WHERE user_id=$1 AND status = 'In basket')`, [req.params.userID]
        );
        if (orderlines.rows.length === 0){
            return res.json(orderlines.rows)
        }
        console.log('laa')
        res.json(orderlines.rows)
    } catch(err) {
        res.status(500).json({ error: 'Database error'})
    }
});

//Create order if non existing
router.post('/create_order', express.json(), async (req, res) => {
        console.log("aaa", req.body)
    const { user_id } = req.body;
    console.log("useris", user_id)
    try {
        // Check if user already exists
        const existingOrder = await pool.query(
            'SELECT status FROM orders o WHERE user_id = $1  AND status = $2',
            [user_id, 'In basket']
        );
        if (existingOrder.rows.length > 0) {
            console.log("i vaske")
            return res.json({ success: true});
        }
        console.log("insert")
        const newUser = await pool.query(
            'INSERT INTO orders (user_id, status) VALUES ($1, $2);',
            [user_id, 'In basket']
        );

        // Respond with success
        res.json({ success: true });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Database error' });
    }
});

//Create a new orderline
router.post('/order_line', async (req, res)=> {
    const {user, product, amount, price} = req.body;
    console.log('haha', user, product, amount, price)
    try {
        const exsitingOrderLine = await pool.query(
            `select * from order_lines where 
            product_id = $2 and user_id = $1 and 
            order_id = (SELECT order_id from orders where user_id = $1 and status = 'In basket')`, [user, product]
        )
        if (exsitingOrderLine.rows.length > 0) {
            const updateOrderLine = await pool.query(
                `UPDATE order_lines SET amount = amount + $3 WHERE product_id = $2 AND user_id = $1 AND 
                order_id = (SELECT order_id FROM orders WHERE user_id = $1 AND status = 'In basket')`, [user, product, amount]
            );
        } else if (exsitingOrderLine.rows.length === 0) {
            const newOrderLine = await pool.query(
                `INSERT INTO order_lines (user_id, product_id, amount, price_at_purchase, order_id) VALUES ($1, $2, $3, $4,  
                (SELECT order_id from orders where user_id = $1 and status = 'In basket'))`, [user, product, amount, price]
            );
        }
    } catch(err) {
        res.status(500).json({ error: 'Database error'})
    }
});

router.put('/amount_changed', async (req, res)=> {
    const {user, product_id, amount} = req.body;
    console.log('hej jag aaa')
    try {
        const updateOrderLine = await pool.query(
                `UPDATE order_lines SET amount = $3 WHERE product_id = $2 AND user_id = $1 AND 
                order_id = (SELECT order_id FROM orders WHERE user_id = $1 AND status = 'In basket')`, [user, product_id, amount]
            );
    } catch(err) {
        res.status(500).json({ error: 'Database error'})
    }
});

//For login
router.post('/login', express.json(), async (req, res) => {
    try {
        const { email, password } = req.body;
         if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Email and password are required' });
        }
        const userResult = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
        if (userResult.rows.length === 0) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
        const user = userResult.rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
        req.session.user = { id: user.user_id, email: user.email }; //store login info in session
        req.session.save(err => {
            if (err) {
                console.error('Session save error:', err);
                return res.status(500).json({ success: false, error: 'Session error' });
            }
            res.json({ success: true, user: { id: user.user_id, email: user.email } });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

router.post('/signup', express.json(), async (req, res) => {
    const { email, password, name} = req.body;

    // Basic validation
    if (!email || !password || !name) {
        return res.status(400).json({ success: false, message: 'Email, password and name are required' });
    }

    try {
        // Check if user already exists
        const existingUser = await pool.query(
            'SELECT * FROM users WHERE email=$1',
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({ success: false, message: 'Email already registered' });
        }

        // Insert new user with hashed password
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await pool.query(
            'INSERT INTO users (email, password, username) VALUES ($1, $2, $3) RETURNING *',
            [email, hashedPassword, name]
        );

        // Respond with success
        res.json({ success: true, user: newUser.rows[0] });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Database error' });
    }
});

//logout route
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Session destroy error:', err);
            return res.status(500).json({ success: false, error: 'Failed to logout' });
        }
        res.json({ success: true });
    });
});

//Get if user is logged in, if they are it returns logged_in(bool) id: user.user_id, email: user.email, see profile.html line 132-139 for how to use
router.get('/me', async (req, res) => {
    if (req.session.user) {
        res.json({ logged_in: true, user: req.session.user });
    } else {
        res.json({ logged_in: false });
    }
});

router.put('/buy_basket', async (req, res)=> {
    const {user} = req.body;
    console.log('rrrrrrrr')
    try {
        console.log('here', user)
        const updateOrderLine = await pool.query(
                `UPDATE orders SET status = 'Sent' WHERE user_id = $1 AND status = 'In basket'`, [user]
            );
    } catch(err) {
        res.status(500).json({ error: 'Database error'})
    }
});



module.exports = router;