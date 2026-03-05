//Keep all functions here


async function addToCart(productId, quantity) {
    console.log("addToCart called with productId:", productId, "quantity:", quantity);
    const user = await getUser();
    if (!user) {
        alert('Please log in to add items to your cart.');
        return;
    }
    console.log(`Banned: ${user.banned}`)
    if (user.banned) {
        alert('You are banned and cannot add items to your cart')
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

async function buyOrder() {
    window.alert("You just bought it!");
    const user = await getUser(); //Get user ID from session or set to null if not logged in
    const user_id = user ? user.id : null;
    console.log("fff", user)
    fetch('/api/basket_to_order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: user_id})
    });
    const banner = document.querySelector('.basket-banner');
    banner.classList.remove('active');
    document.getElementsByClassName("buy-btn")[0].style.display = "none";
};

async function loadOrderDetails(orderId) {
    const orderLineResponse = await fetch(`/api/order_lines/${orderId}`);
    if (!orderLineResponse.ok) {
        throw new Error("Order lines not found");
    }
    const orderLines = await orderLineResponse.json();
    return orderLines;
}

async function getURL(productId) {
    const response = await fetch(`/api/products/${productId}`);
    const product = await response.json();
    console.log("product in getURL", product);
    return product.image_url;
}

async function getName(productId) {
    const response = await fetch(`/api/products/${productId}`);
    const product = await response.json();
    console.log("product in getName", product);
    return product.name;
}

async function renderOrderLines(orderLines) {
    const container = document.getElementById('order-lines');
    container.innerHTML = '';
    let total = 0;
    for (const line of orderLines) {
        total += line.amount*line.price_at_purchase;
        const lineElement = document.createElement("div");
        lineElement.classList.add("order-line");
        const URL = await getURL(line.product_id);
        const name = await getName(line.product_id);
        console.log("URL in renderOrderLines", URL);
        lineElement.innerHTML = `
            <img src="${URL}" alt="${line.name}">
            <div class="order-info">
                <h3>${name}</h3>
                <p>Quantity: ${line.amount}</p>
                <p>Price: ${line.price_at_purchase.toFixed(2)} kr</p>
                <p><strong>Subtotal: ${(line.amount * line.price_at_purchase).toFixed(2)} kr</strong></p>
            </div>
        `;
        container.appendChild(lineElement);
    }

    const totalElement = document.createElement('h2');
    totalElement.textContent = `Total: ${total.toFixed(2)} kr`;
    container.appendChild(totalElement);
}

//Den här låg i product men används ingenstans???
async function amountChanged(input) {
    const product_id = input.id;
    const product = document.getElementById(product_id);
    const currentValue = parseInt(product.value);

    if (currentValue < 0) {
        product.value = 0;
        return;
    }

    if (currentValue === 0) {
        const user = await getUser();
        const user_id = user ? user.id : null;
        await fetch('/api/remove_from_basket', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: user_id, product_id: product_id })
        });
        input.closest('.product-line').remove();
        return;
    }

    const user = await getUser();
    const user_id = user ? user.id : null;
    fetch('/api/update_basket', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user_id, product_id: product_id, amount: currentValue })
    });
}


async function showReviews(productId) {
    console.log("hereeee")
    const user = await getUser(); //Get user ID from session or set to null if not logged in
    const userId = user ? user.id : null;
    console.log("hhhahahaha", user);
    const review_div = document.getElementById("review-div");
    review_div.innerHTML = '';
    fetch(`/api/bought/${userId}/${productId}`)
    .then(res => {
            if (!res.ok) throw new Error("Error");
            return res.json();
        })
        .then(bought => {
            if (bought) {
                const add_review_btn = document.createElement("button");
                add_review_btn.setAttribute("class", "add-review-btn");
                add_review_btn.setAttribute("onclick", "add_review()");
                add_review_btn.innerHTML = "Add a review";
                review_div.appendChild(add_review_btn);
            }
            loadReviews(userId, productId)
        })
        .catch(err => {
            console.error(err);
    });
}

function loadReviews(userId, productId) {
    fetch(`/api/load_reviews/${productId}`)
    .then(res => {
            if (!res.ok) throw new Error("Error loading reviews");
            return res.json();
        })
        .then(reviews_obj => {
            reviews = reviews_obj.reviews
            const reviewDiv = document.getElementById("review-div")
            reviews.forEach(review => {
                const parentId = review.parent_id;
                const grade = review.grade;
                const comment = review.comment;
                const date = review.date;
                const userName = review.username;
                const reviewId = review.review_id;
                console.log(review, parentId)
                if (parentId == null) {
                    const oneReview = document.createElement("div");
                    oneReview.setAttribute("id", `review-${reviewId}`);
                    oneReview.setAttribute("class", `review`);
                    oneReview.innerHTML = `<div class="user-name">${userName}</div>
                    <div class="grade">Grade: ${grade}/5</div>
                    <div class="comment">Comment: ${comment}</div>
                    <div class="review-date">${date.split("T")[0]}</div>
                    <div class="reply-review" onclick="replyReview(this, ${reviewId})">Reply</div>`; //lite security risk men ...
                    reviewDiv.appendChild(oneReview);
                } else {
                    const replyDiv = document.getElementById(`review-${parentId}`)
                    console.log("llll", replyDiv, reviewDiv, `review-${parentId}`)
                    const oneReply = document.createElement("div");
                    oneReply.setAttribute("id", `review-${reviewId}`);
                    oneReply.setAttribute("class", "reply");
                    oneReply.innerHTML = `<div class="user-name">${userName}</div>
                    <div class="comment">Comment: ${comment}</div>
                    <div class="review-date">${date.split("T")[0]}</div>
                    <div class="reply-review" onclick="replyReview(this, ${reviewId})">Reply</div>`; //lite security risk men ...
                    replyDiv.appendChild(oneReply);
                }
            });
            
        })
        .catch(err => {
            console.error(err, "Error from database loading reviews");
    });
}

function replyReview(element, reviewId) {
    console.log("yeee", element.parentNode)
    const replyDiv = element.parentNode
    const newReply = document.createElement("div");
    newReply.setAttribute("class", "new-reply-div")
    newReply.innerHTML = `
            <div class="comment-div">
                <div>Comment: </div>
                <textarea id="comment-box" name="comment-box" rows="4" cols="100"></textarea>
            </div>
            <button class="save-review-btn" onclick="saveReply(${reviewId})">Save reply</button>
    `;
    replyDiv.appendChild(newReply);
    replyDiv.removeChild(element)
}

async function saveReply(reviewId) {
    const user = await getUser(); //Get user ID from session or set to null if not logged in
    const userId = user ? user.id : null;
    const productId = window.location.pathname.split("/").pop();
    const comment = document.getElementById("comment-box").value;
    await fetch('/api/post_reply', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({user_id: userId, product_id: productId, comment: comment, parent_id: reviewId})
    });
    console.log("kom den hit")
    showReviews(productId);
}


function add_review() {
    const reviewDiv = document.getElementById("review-div")
    reviewDiv.innerHTML = '';
    const newReview = document.createElement("div");
    newReview.setAttribute("class", "new-review-div")
    newReview.innerHTML = `
            <div class="comment-div">
                <div>Comment: </div>
                <textarea id="comment-box" name="comment-box" rows="4" cols="100"></textarea>
            </div>
            <div class="grade-input">
                <div>Grade: </div>
                <input type="number" min="0" max="5" id="grade-review">
            </div>
            <button class="save-review-btn" onclick="saveReview()">Save review</button>
    `;
    reviewDiv.appendChild(newReview);
}

async function saveReview() {
    const user = await getUser(); //Get user ID from session or set to null if not logged in
    const userId = user ? user.id : null;
    const productId = window.location.pathname.split("/").pop();
    const comment = document.getElementById("comment-box").value;
    const grade = document.getElementById("grade-review").value;
    await fetch('/api/post_review', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({user_id: userId, product_id: productId, comment: comment, grade: grade})
    });
    console.log("kom den hit")
    showReviews(productId);
}

/* Admin functionality */
    async function makeAdmin(userId) {
        try {
            const res = await fetch(`/api/users/${userId}/make_admin`, { method: 'PUT' });
            if (!res.ok) throw new Error('Failed to update role');
            alert('User is now admin!');
        } catch(err) {
            alert('Error: ' + err.message);
        }
    }

    async function removeAdmin(userId) {
        try {
            const res = await fetch(`/api/users/${userId}/remove_admin`, { method: 'PUT' });
            if (!res.ok) throw new Error('Failed to update role');
            alert('Admin role removed!');
        } catch(err) {
            alert('Error: ' + err.message);
        }
    }
    async function deleteReview(reviewId, btn) {
        if (!confirm('Are you sure you want to delete this review?')) return;
        try {
            const res = await fetch(`/api/reviews/${reviewId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete review');
            btn.closest('tr').remove();
        } catch(err) {
            alert('Error: ' + err.message);
        }
    }

    async function banCustomer(userId){
        try {
            const res = await fetch(`/api/ban/${userId}`, {method: 'PUT'});
            console.log(res)
            if (!res.ok) throw new Error('Failed to ban customer');
            alert('Customer banned')
        } catch(err) {
            alert('Error: ' + err.message);
        }
    }

    async function unbanCustomer(userId){
        if(!confirm(`Do you want to unban user ${userId}?`)) return;
        try {
            const res = await fetch(`/api/unban/${userId}`, {method: 'PUT'});
            if (!res.ok) throw new Error('Failed to unban customer');
        } catch(err) {
            alert('Error: ' + err.message);
        }
    }

    async function deleteProduct(productId){
        try {
            const res = await fetch(`/api/products/${productId}`, {method: 'DELETE'});
            console.log(res)
            if (!res.ok) throw new Error('Failed to delete product');
        } catch(err) {
            alert('Error: ' + err.message);
        }
    }

    async function adjustProduct(productId, field, newValue){
        console.log('adjustProduct called with:', productId, field, newValue);
        try {
            const res = await fetch(`/api/products_new/${productId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ field: field, new_value: newValue })
            });    
            if (!res.ok) throw new Error('Failed to adjust product'); 
        } catch(err) {
            alert('Error: ' + err.message);
        }
    }
    function makeEditable(elementId, field, productId) {
    const el = document.getElementById(elementId);
    el.style.cursor = 'pointer';
    el.title = 'Click to edit';
    el.addEventListener('click', () => {
        const current = el.textContent;
        const input = document.createElement('input');
        input.value = current;
        input.style.fontSize = 'inherit';
        input.style.width = '100%';
        el.replaceWith(input);
        input.focus();

        input.addEventListener('blur', async () => {
            const newValue = input.value.trim();
            console.log('Saving:', field, newValue);
            await adjustProduct(productId, field, newValue);
            input.replaceWith(el);
            el.textContent = newValue;
        });

        // Save on Enter key
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') input.blur();
            if (e.key === 'Escape') {
                input.replaceWith(el); // cancel edit
            }
        });
    });
}