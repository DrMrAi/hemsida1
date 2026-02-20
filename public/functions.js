//Keep all functions here


async function addToCart(productId, quantity) {
    console.log("addToCart called with productId:", productId, "quantity:", quantity);
    const user = await getUser();
    if (!user) {
        alert('Please log in to add items to your cart.');
        return;
    }
    const basket_info = await fetch(`/api/basket/${user.id}`).then(res => res.json());
    console.log("Received data from /api/basket/:id: for function addToCart", basket_info);
    if (basket_info.length === 0) {
        await fetch('/api/create_basket', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({user_id: user.id})
        });
        console.log("Basket created for user:", user.id);}
    const response = await fetch('/api/add_to_basket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({user_id: user.id, product_id: productId, amount: quantity})
    });
    console.log("Added to basket for user:", user.id, "product:", productId, "quantity:", quantity);
    const data = await response.json();
    console.log("Received data from /api/add_to_basket: for function addToCart", data);
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({user_id: user.id})
    });
}

async function getUser() {
    const response = await fetch('/api/me');
    const data = await response.json();
    console.log("Received data from /api/me: for function getUser", data);
    return data.user;
}


async function renderCart() {
    console.log("qqqqqqqqqq")
    const user = await getUser(); //Get user ID from session or set to null if not logged in
    const user_id = user ? user.id : null;
    console.log("Received user_id from getUser():", user_id);
    console.log("user_id in renderCart:", user_id);
    if (!user_id) {
        alert('Please log in to view your cart.');
        return;
    }
    fetch(`/api/basket/${user_id}`)
        .then(res => {
            if (!res.ok) throw new Error("Product not found");
            return res.json();
        })
        .then(products => {
            console.log("Yippie", products);
            const list = document.getElementById("shopping_basket");
            list.innerHTML = "";
            let total = 0;
            console.log("aaa", products.length)
            if (products.length === 0) {
                const li = document.createElement("li");
                li.textContent = `No Products :(`;
                list.appendChild(li);
            } else if (products.length > 0){
                products.forEach(item => {
                    console.log("item", item);
                    if (item.amount > 0) {
                        const productLine = document.createElement("div");
                        productLine.setAttribute("class", "product-line")
                        const pProducts = document.createElement("p");
                        pProducts.innerText = `${item.name} (${item.price} kr): `;
                        productLine.appendChild(pProducts);
                        const changeAmount = document.createElement("input");
                        changeAmount.setAttribute("type", "number");
                        changeAmount.setAttribute("value", item.amount);
                        changeAmount.setAttribute("class", "amountInput");
                        changeAmount.setAttribute("min", "0");
                        changeAmount.setAttribute("onchange", "amountChanged(this)");
                        changeAmount.setAttribute("id", item.product_id);
                        productLine.appendChild(changeAmount);
                        list.appendChild(productLine);
                        total += item.price * item.amount;
                        console.log("total", total, item.price)
                    }
                });
                const txtTotal = document.createElement('p')
                txtTotal.innerText = `Your total is: ${total.toFixed(2)} kr`
                list.appendChild(txtTotal)
                document.getElementsByClassName("buy-btn")[0].style.display = "inline";
                
            }
        })
        .catch(err => {
            console.error(err);
            //LÄGG TILL ERROR KANSKE??
        });
}