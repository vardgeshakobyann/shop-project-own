let iconCart = document.querySelector('.icon-cart');
let closeCart = document.querySelector('.close');
let body = document.querySelector('body');
let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCartSpan = document.querySelector('.icon-cart span');

let listProducts = [];
let carts = [];

iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
})

closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
})

const addDataToHTML = () => {
    listProductHTML.innerHTML = '';
    if (listProducts.length > 0) {
        listProducts.forEach(product => {
            let newProdcut = document.createElement('div');
            newProdcut.classList.toggle('item');
            newProdcut.dataset.id = product.id;
            newProdcut.innerHTML = `
                <img src="./images/${product.id}.png"/>
                <h2>${product.name}</h2>
                <div class="price">$${product.price}</div>
                <button class="addCart" onClick="addCart(${product.id})">Add to Cart</button>
            `;
            listProductHTML.append(newProdcut);
        })
    }
}

const addCart = (id) => {
    let positionThisProductInCart = carts.findIndex((value) => value.id === id);
    if (carts.length <= 0) {
        carts = [{
            id: id,
            quantity: 1
        }]
    } else if (positionThisProductInCart < 0) {
        carts.push({
            id: id,
            quantity: 1
        })
    } else {
        carts[positionThisProductInCart].quantity++
    }

    addCartToHTML();
    addCartToMemory();
}

const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(carts))
}

const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    if (carts.length > 0) {
        carts.forEach(cart => {
            totalQuantity += cart.quantity;
            let newCart = document.createElement('div');
            newCart.classList.toggle('item');
            newCart.dataset.id = cart.id;
            let positionProduct = listProducts.findIndex((value) => value.id === cart.id);
            let info = listProducts[positionProduct];

            newCart.innerHTML = `
                <div class="image">
                <img src="${info.images}"/>
                </div>
                <div class="name">
                    ${info.name}
                </div>
                <div class="totalPrice">
                    $${info.price * cart.quantity}
                </div>
                <div class="quantity">
                    <span class="minus"><</span>
                    <span>${cart.quantity}</span>
                    <span class="plus">></span>
                </div>
            `;
            listCartHTML.append(newCart)
        })
    }

    iconCartSpan.innerText = totalQuantity
}

listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
        let id = positionClick.parentElement.parentElement.dataset.id;
        let type = 'minus';
        if (positionClick.classList.contains('plus')) {
            type = 'plus';
        }
        changeQuantity(id, type);
    }
})

const changeQuantity = (id, type) => {
    let positionItemInCart = carts.findIndex((value) => value.id == id);
    if (positionItemInCart >= 0) {
        switch (type) {
            case 'plus':
                carts[positionItemInCart].quantity++
                break;
            default:
                let valueChange = carts[positionItemInCart].quantity = carts[positionItemInCart].quantity - 1;
                if (valueChange > 0) {
                    carts[positionItemInCart].quantity = valueChange;
                } else {
                    carts.splice(positionItemInCart, 1);
                }
        }
    }
    addCartToMemory();
    addCartToHTML();
}

const initalApp = () => {
    fetch('products.json')
    .then(response => response.json())
    .then(data => {
        listProducts = data;
        addDataToHTML();

        if (localStorage.getItem('cart')) {
            carts = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();
        }
    })
}

initalApp();