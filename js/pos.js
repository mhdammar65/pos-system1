// ==========================================
// WOOD & CURTAIN POS
// NEW SALE / POS SYSTEM
// ==========================================


// ==========================================
// PRODUCTS / CART
// ==========================================

let products = [];
let cart = [];

let selectedCategory = "all";
let paymentMethod = "Cash";
let discountAmount = 0;


// ==========================================
// LOAD PRODUCTS
// ==========================================

function loadProducts() {

    products =
        JSON.parse(
            localStorage.getItem("woodCurtainProducts")
        ) || [];

}


// ==========================================
// SAVE PRODUCTS
// ==========================================

function saveProducts() {

    localStorage.setItem(
        "woodCurtainProducts",
        JSON.stringify(products)
    );

}


// ==========================================
// CURRENCY
// ==========================================

function currency(amount) {

    return "Rs. " +
        Number(amount || 0).toLocaleString(
            "en-LK",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ==========================================
// ELEMENTS
// ==========================================

const productSearch =
    document.getElementById("productSearch");

const productGrid =
    document.getElementById("posProductGrid");

const productCount =
    document.getElementById("productCount");

const productEmpty =
    document.getElementById("posEmpty");

const cartItems =
    document.getElementById("cartItems");

const cartEmpty =
    document.getElementById("cartEmpty");

const cartItemCount =
    document.getElementById("cartItemCount");

const subtotalElement =
    document.getElementById("subtotal");

const discountInput =
    document.getElementById("discount");

const grandTotalElement =
    document.getElementById("grandTotal");

const completeSaleTotal =
    document.getElementById("completeSaleTotal");

const cashReceived =
    document.getElementById("cashReceived");

const changeElement =
    document.getElementById("change");

const completeSaleButton =
    document.getElementById("completeSale");

const clearCartButton =
    document.getElementById("clearCart");

const invoiceNumberElement =
    document.getElementById("invoiceNumber");

const successOverlay =
    document.getElementById("successOverlay");

const successInvoice =
    document.getElementById("successInvoice");

const successTotal =
    document.getElementById("successTotal");

const printInvoiceButton =
    document.getElementById("printInvoice");

const newSaleAfterButton =
    document.getElementById("newSaleAfter");


// ==========================================
// INVOICE NUMBER
// ==========================================

function getCurrentInvoiceNumber() {

    const number =
        Number(
            localStorage.getItem(
                "woodCurtainInvoiceNumber"
            )
        ) || 1;

    return "INV-" +
        String(number).padStart(6, "0");

}


function increaseInvoiceNumber() {

    let number =
        Number(
            localStorage.getItem(
                "woodCurtainInvoiceNumber"
            )
        ) || 1;

    number++;

    localStorage.setItem(
        "woodCurtainInvoiceNumber",
        number
    );

}


function updateInvoiceNumber() {

    if (invoiceNumberElement) {

        invoiceNumberElement.textContent =
            getCurrentInvoiceNumber();

    }

}


// ==========================================
// RENDER PRODUCTS
// ==========================================

function renderProducts() {

    loadProducts();

    if (!productGrid) {

        console.error(
            "posProductGrid not found."
        );

        return;

    }


    const search =
        productSearch
            ? productSearch.value
                .toLowerCase()
                .trim()
            : "";


    const filteredProducts =
        products.filter(product => {

            const name =
                String(
                    product.name || ""
                ).toLowerCase();

            const sku =
                String(
                    product.sku || ""
                ).toLowerCase();

            const barcode =
                String(
                    product.barcode || ""
                ).toLowerCase();

            const category =
                String(
                    product.category || ""
                );


            const matchesSearch =
                name.includes(search) ||
                sku.includes(search) ||
                barcode.includes(search);


            const matchesCategory =
                selectedCategory === "all" ||
                category === selectedCategory;


            return (
                matchesSearch &&
                matchesCategory
            );

        });


    productGrid.innerHTML = "";


    if (productCount) {

        productCount.textContent =
            filteredProducts.length +
            (
                filteredProducts.length === 1
                    ? " product"
                    : " products"
            );

    }


    if (filteredProducts.length === 0) {

        productGrid.style.display = "none";

        if (productEmpty) {

            productEmpty.style.display =
                "block";

        }

        return;

    }


    productGrid.style.display = "grid";


    if (productEmpty) {

        productEmpty.style.display =
            "none";

    }


    // ======================================
    // PRODUCT CARDS
    // ======================================

    filteredProducts.forEach(product => {

        const card =
            document.createElement("div");

        card.className =
            "pos-product-card";


        const stock =
            Number(product.stock || 0);

        const outOfStock =
            stock <= 0;


        card.innerHTML = `

            <div class="pos-product-image">
                🪵
            </div>

            <div class="pos-product-info">

                <h3>
                    ${escapeHTML(
                        product.name ||
                        "Unnamed Product"
                    )}
                </h3>

                <p class="pos-product-sku">
                    SKU:
                    ${escapeHTML(
                        product.sku || "-"
                    )}
                </p>

                <p class="pos-product-category">
                    ${escapeHTML(
                        product.category || "-"
                    )}
                </p>

            </div>

            <div class="pos-product-bottom">

                <strong class="pos-product-price">
                    ${currency(product.price)}
                </strong>

                <span class="pos-product-stock">
                    ${
                        outOfStock
                            ? "Out of Stock"
                            : "Stock: " + stock
                    }
                </span>

            </div>

            <button
                type="button"
                class="pos-add-product"
                ${outOfStock ? "disabled" : ""}
            >
                ${
                    outOfStock
                        ? "Out of Stock"
                        : "+ Add"
                }
            </button>

        `;


        const addButton =
            card.querySelector(
                ".pos-add-product"
            );


        if (!outOfStock) {

            addButton.addEventListener(
                "click",
                function(event) {

                    event.stopPropagation();

                    addToCart(product.id);

                }
            );


            card.addEventListener(
                "click",
                function() {

                    addToCart(product.id);

                }
            );

        }


        productGrid.appendChild(card);

    });

}


// ==========================================
// ADD PRODUCT TO CART
// ==========================================

function addToCart(productId) {

    loadProducts();


    const product =
        products.find(
            item =>
                String(item.id) ===
                String(productId)
        );


    if (!product) {

        alert(
            "Product not found."
        );

        return;

    }


    const stock =
        Number(product.stock || 0);


    if (stock <= 0) {

        alert(
            "This product is out of stock."
        );

        return;

    }


    const existing =
        cart.find(
            item =>
                String(item.id) ===
                String(productId)
        );


    if (existing) {

        if (
            existing.quantity >=
            stock
        ) {

            alert(
                "You cannot add more than the available stock."
            );

            return;

        }


        existing.quantity++;

    } else {

        cart.push({

            id:
                product.id,

            name:
                product.name,

            sku:
                product.sku,

            category:
                product.category,

            price:
                Number(product.price || 0),

            stock:
                stock,

            quantity:
                1

        });

    }


    renderCart();

}


// ==========================================
// CHANGE QUANTITY
// ==========================================

function changeQuantity(
    productId,
    change
) {

    const item =
        cart.find(
            product =>
                String(product.id) ===
                String(productId)
        );


    if (!item) {

        return;

    }


    const newQuantity =
        item.quantity + change;


    if (newQuantity <= 0) {

        removeFromCart(productId);

        return;

    }


    if (newQuantity > item.stock) {

        alert(
            "You cannot sell more than the available stock."
        );

        return;

    }


    item.quantity =
        newQuantity;


    renderCart();

}


// ==========================================
// REMOVE FROM CART
// ==========================================

function removeFromCart(productId) {

    cart =
        cart.filter(
            item =>
                String(item.id) !==
                String(productId)
        );


    renderCart();

}


// ==========================================
// RENDER CART
// ==========================================

function renderCart() {

    if (!cartItems) {

        return;

    }


    cartItems.innerHTML = "";


    if (cart.length === 0) {

        if (cartEmpty) {

            cartEmpty.style.display =
                "block";

            cartItems.appendChild(
                cartEmpty
            );

        }

    } else {

        if (cartEmpty) {

            cartEmpty.style.display =
                "none";

        }


        cart.forEach(item => {

            const row =
                document.createElement("div");

            row.className =
                "cart-item";


            row.innerHTML = `

                <div class="cart-item-info">

                    <strong>
                        ${escapeHTML(
                            item.name
                        )}
                    </strong>

                    <small>
                        ${escapeHTML(
                            item.sku || ""
                        )}
                    </small>

                    <span>
                        ${currency(item.price)}
                    </span>

                </div>


                <div class="cart-item-controls">

                    <button
                        type="button"
                        class="cart-minus"
                    >
                        −
                    </button>

                    <strong>
                        ${item.quantity}
                    </strong>

                    <button
                        type="button"
                        class="cart-plus"
                    >
                        +
                    </button>

                </div>


                <strong class="cart-item-total">
                    ${currency(
                        item.price *
                        item.quantity
                    )}
                </strong>


                <button
                    type="button"
                    class="cart-remove"
                    title="Remove"
                >
                    🗑️
                </button>

            `;


            row
                .querySelector(
                    ".cart-minus"
                )
                .addEventListener(
                    "click",
                    function() {

                        changeQuantity(
                            item.id,
                            -1
                        );

                    }
                );


            row
                .querySelector(
                    ".cart-plus"
                )
                .addEventListener(
                    "click",
                    function() {

                        changeQuantity(
                            item.id,
                            1
                        );

                    }
                );


            row
                .querySelector(
                    ".cart-remove"
                )
                .addEventListener(
                    "click",
                    function() {

                        removeFromCart(
                            item.id
                        );

                    }
                );


            cartItems.appendChild(row);

        });

    }


    updateTotals();

}


// ==========================================
// UPDATE TOTALS
// ==========================================

function updateTotals() {

    const subtotal =
        cart.reduce(
            (total, item) =>
                total +
                (
                    Number(item.price) *
                    Number(item.quantity)
                ),
            0
        );


    discountAmount =
        Number(
            discountInput
                ? discountInput.value || 0
                : 0
        );


    if (discountAmount < 0) {

        discountAmount = 0;

    }


    if (discountAmount > subtotal) {

        discountAmount =
            subtotal;


        if (discountInput) {

            discountInput.value =
                subtotal;

        }

    }


    const total =
        Math.max(
            0,
            subtotal - discountAmount
        );


    const itemCount =
        cart.reduce(
            (total, item) =>
                total +
                Number(item.quantity),
            0
        );


    if (cartItemCount) {

        cartItemCount.textContent =
            itemCount +
            (
                itemCount === 1
                    ? " item"
                    : " items"
            );

    }


    if (subtotalElement) {

        subtotalElement.textContent =
            currency(subtotal);

    }


    if (grandTotalElement) {

        grandTotalElement.textContent =
            currency(total);

    }


    if (completeSaleTotal) {

        completeSaleTotal.textContent =
            currency(total);

    }


    updateChange();

}


// ==========================================
// UPDATE CHANGE
// ==========================================

function updateChange() {

    const subtotal =
        cart.reduce(
            (total, item) =>
                total +
                (
                    Number(item.price) *
                    Number(item.quantity)
                ),
            0
        );


    const total =
        Math.max(
            0,
            subtotal - discountAmount
        );


    const received =
        Number(
            cashReceived
                ? cashReceived.value || 0
                : 0
        );


    const change =
        Math.max(
            0,
            received - total
        );


    if (changeElement) {

        changeElement.textContent =
            currency(change);

    }

}


// ==========================================
// CATEGORY BUTTONS
// ==========================================

document
    .querySelectorAll(".pos-category")
    .forEach(button => {

        button.addEventListener(
            "click",
            function() {

                document
                    .querySelectorAll(
                        ".pos-category"
                    )
                    .forEach(btn =>
                        btn.classList.remove(
                            "active"
                        )
                    );


                this.classList.add(
                    "active"
                );


                selectedCategory =
                    this.dataset.category;


                renderProducts();

            }
        );

    });


// ==========================================
// SEARCH
// ==========================================

if (productSearch) {

    productSearch.addEventListener(
        "input",
        function() {

            renderProducts();

        }
    );

}


// ==========================================
// DISCOUNT
// ==========================================

if (discountInput) {

    discountInput.addEventListener(
        "input",
        function() {

            updateTotals();

        }
    );

}


// ==========================================
// CASH RECEIVED
// ==========================================

if (cashReceived) {

    cashReceived.addEventListener(
        "input",
        function() {

            updateChange();

        }
    );

}


// ==========================================
// PAYMENT METHODS
// ==========================================

document
    .querySelectorAll(".payment-method")
    .forEach(button => {

        button.addEventListener(
            "click",
            function() {

                document
                    .querySelectorAll(
                        ".payment-method"
                    )
                    .forEach(btn =>
                        btn.classList.remove(
                            "active"
                        )
                    );


                this.classList.add(
                    "active"
                );


                paymentMethod =
                    this.dataset.method;


                const cashPayment =
                    document.getElementById(
                        "cashPayment"
                    );


                if (cashPayment) {

                    cashPayment.style.display =
                        paymentMethod === "Cash"
                            ? "block"
                            : "none";

                }

            }
        );

    });


// ==========================================
// QUICK CASH
// ==========================================

document
    .querySelectorAll("[data-cash]")
    .forEach(button => {

        button.addEventListener(
            "click",
            function() {

                const value =
                    this.dataset.cash;


                if (value === "exact") {

                    const subtotal =
                        cart.reduce(
                            (total, item) =>
                                total +
                                (
                                    Number(item.price) *
                                    Number(item.quantity)
                                ),
                            0
                        );


                    const total =
                        Math.max(
                            0,
                            subtotal -
                            discountAmount
                        );


                    if (cashReceived) {

                        cashReceived.value =
                            total.toFixed(2);

                    }

                } else {

                    if (cashReceived) {

                        cashReceived.value =
                            value;

                    }

                }


                updateChange();

            }
        );

    });


// ==========================================
// CLEAR CART
// ==========================================

if (clearCartButton) {

    clearCartButton.addEventListener(
        "click",
        function() {

            if (cart.length === 0) {

                return;

            }


            const confirmed =
                confirm(
                    "Are you sure you want to clear this sale?"
                );


            if (!confirmed) {

                return;

            }


            cart = [];


            if (discountInput) {

                discountInput.value =
                    0;

            }


            if (cashReceived) {

                cashReceived.value =
                    "";

            }


            renderCart();

        }
    );

}


// ==========================================
// COMPLETE SALE
// ==========================================

if (completeSaleButton) {

    completeSaleButton.addEventListener(
        "click",
        completeSale
    );

}


// ==========================================
// COMPLETE SALE FUNCTION
// ==========================================

function completeSale() {

    if (cart.length === 0) {

        alert(
            "Please add at least one product to the sale."
        );

        return;

    }


    const subtotal =
        cart.reduce(
            (total, item) =>
                total +
                (
                    Number(item.price) *
                    Number(item.quantity)
                ),
            0
        );


    const total =
        Math.max(
            0,
            subtotal - discountAmount
        );


    // ======================================
    // CASH VALIDATION
    // ======================================

    if (paymentMethod === "Cash") {

        const received =
            Number(
                cashReceived
                    ? cashReceived.value || 0
                    : 0
            );


        if (received < total) {

            alert(
                "Cash received is less than the sale total."
            );

            return;

        }

    }


    // ======================================
    // LOAD PRODUCTS
    // ======================================

    loadProducts();


    // ======================================
    // CHECK STOCK
    // ======================================

    for (const cartItem of cart) {

        const product =
            products.find(
                item =>
                    String(item.id) ===
                    String(cartItem.id)
            );


        if (!product) {

            alert(
                "Product " +
                cartItem.name +
                " no longer exists."
            );

            return;

        }


        const currentStock =
            Number(product.stock || 0);


        if (
            currentStock <
            cartItem.quantity
        ) {

            alert(
                `Not enough stock for "${cartItem.name}". Available: ${currentStock}`
            );

            return;

        }

    }


    // ======================================
    // UPDATE STOCK
    // ======================================

    cart.forEach(cartItem => {

        const product =
            products.find(
                item =>
                    String(item.id) ===
                    String(cartItem.id)
            );


        product.stock =
            Number(product.stock || 0) -
            Number(cartItem.quantity);

    });


    saveProducts();


    // ======================================
    // CUSTOMER
    // ======================================

    const customerSelect =
        document.getElementById(
            "customerSelect"
        );


    const customer =
        customerSelect
            ? (
                customerSelect.value ||
                "Walk-in Customer"
            )
            : "Walk-in Customer";


    // ======================================
    // PAYMENT
    // ======================================

    const received =
        Number(
            cashReceived
                ? cashReceived.value || 0
                : 0
        );


    const change =
        paymentMethod === "Cash"
            ? Math.max(
                0,
                received - total
            )
            : 0;


    // ======================================
    // CREATE SALE
    // ======================================

    const invoice =
        getCurrentInvoiceNumber();


    const sale = {

        id:
            Date.now(),

        invoice:
            invoice,

        date:
            new Date().toISOString(),

        customer:
            customer,

        items:
            cart.map(item => ({

                productId:
                    item.id,

                name:
                    item.name,

                sku:
                    item.sku,

                category:
                    item.category,

                price:
                    item.price,

                quantity:
                    item.quantity,

                total:
                    item.price *
                    item.quantity

            })),

        subtotal:
            subtotal,

        discount:
            discountAmount,

        total:
            total,

        paymentMethod:
            paymentMethod,

        cashReceived:
            received,

        change:
            change

    };


    // ======================================
    // SAVE SALE
    // ======================================

    const sales =
        JSON.parse(
            localStorage.getItem(
                "woodCurtainSales"
            )
        ) || [];


    sales.push(sale);


    localStorage.setItem(
        "woodCurtainSales",
        JSON.stringify(sales)
    );


    // ======================================
    // NEXT INVOICE
    // ======================================

    increaseInvoiceNumber();


    // ======================================
    // SUCCESS
    // ======================================

    if (successInvoice) {

        successInvoice.textContent =
            invoice;

    }


    if (successTotal) {

        successTotal.textContent =
            currency(total);

    }


    if (successOverlay) {

        successOverlay.classList.add(
            "show"
        );

        successOverlay.style.display =
            "flex";

    }


    console.log(
        "Sale completed:",
        sale
    );

}


// ==========================================
// PRINT INVOICE
// ==========================================

if (printInvoiceButton) {

    printInvoiceButton.addEventListener(
        "click",
        function() {

            window.print();

        }
    );

}


// ==========================================
// NEW SALE AFTER SUCCESS
// ==========================================

if (newSaleAfterButton) {

    newSaleAfterButton.addEventListener(
        "click",
        function() {

            if (successOverlay) {

                successOverlay.classList.remove(
                    "show"
                );

                successOverlay.style.display =
                    "none";

            }


            cart = [];

            discountAmount = 0;


            if (discountInput) {

                discountInput.value =
                    0;

            }


            if (cashReceived) {

                cashReceived.value =
                    "";

            }


            updateInvoiceNumber();

            renderProducts();

            renderCart();

        }
    );

}


// ==========================================
// CLOSE SUCCESS MODAL
// ==========================================

if (successOverlay) {

    successOverlay.addEventListener(
        "click",
        function(event) {

            if (
                event.target ===
                successOverlay
            ) {

                successOverlay.classList.remove(
                    "show"
                );

                successOverlay.style.display =
                    "none";

            }

        }
    );

}


// ==========================================
// KEYBOARD SHORTCUT F2
// ==========================================

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "F2") {

            event.preventDefault();


            if (productSearch) {

                productSearch.focus();

            }

        }

    }
);


// ==========================================
// START POS
// ==========================================

loadProducts();

updateInvoiceNumber();

renderProducts();

renderCart();


console.log(
    "Wood & Curtain POS - New Sale loaded successfully."
);
