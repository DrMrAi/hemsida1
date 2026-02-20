//Keep all functions here
const router2 = express.Router();

async function addToCart(productId, quantity) {
    const user = await getUser();
    if (!user) {
        alert('Please log in to add items to your cart.');
        return;
    }
    const basket_info = await fetch(`/api/basket/${user.id}`).then(res => res.json());
    if (basket_info.length === 0) {
        await fetch('/api/create_basket', {
            method: 'POST',
            body: JSON.stringify({user_id: user.id})
        });
    const response = await fetch('/api/add_to_basket', {
        method: 'POST',
        body: JSON.stringify({user_id: user.id, product_id: productId, quantity})
    });
    const data = await response.json();
    console.log("Received data from /api/add_to_basket: for function addToCart", data);
    }
}

async function getCart() {
    const user = await getUser();
    const response = await fetch(`/api/basket/${user.id}`);
    const data = await response.json();
    console.log("Received data from /api/basket/:id: for function getCart", data);
    return data;
}

async function checkout() {
    const user = await getUser();
    const response = await fetch(`/api/basket_to_order`, {
        method: 'POST',
        body: JSON.stringify({user_id: user.id})
    });
}

async function getUser() {
    const response = await fetch('/api/me');
    const data = await response.json();
    console.log("Received data from /api/me: for function getUser", data);
    return data.user;
}
module.exports = router2;