// ==========================================
// WOOD & CURTAIN POS
// PRODUCT MANAGEMENT
// ==========================================


// ==========================================
// CATEGORIES
// ==========================================

const categories = [
    "Wooden Poles",
    "End Cups",
    "Brackets",
    "Wood & Poles Full Set"
];


// ==========================================
// STORAGE
// ==========================================

let products =
    JSON.parse(
        localStorage.getItem("woodCurtainProducts")
    ) || [];


// ==========================================
// ELEMENTS
// ==========================================

const productTableBody =
    document.getElementById("productsTableBody");

const emptyProducts =
    document.getElementById("productsEmpty");

const searchProduct =
    document.getElementById("productSearch");

const categoryFilter =
    document.getElementById("productCategoryFilter");

const productModal =
    document.getElementById("productModal");

const productForm =
    document.getElementById("productForm");


// ==========================================
// EDITING
// ==========================================

let editingProductId = null;


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
// LOAD PRODUCTS
// ==========================================

function loadProducts() {

    products =
        JSON.parse(
            localStorage.getItem("woodCurtainProducts")
        ) || [];

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
// PRODUCT STATUS
// ==========================================

function getProductStatus(product) {

    const stock =
        Number(product.stock || 0);

    const minimum =
        Number(product.minimumStock || 5);


    if (stock <= 0) {

        return {
            text: "Out of Stock",
            className: "out-stock"
        };

    }


    if (stock <= minimum) {

        return {
            text: "Low Stock",
            className: "low-stock"
        };

    }


    return {
        text: "In Stock",
        className: "in-stock"
    };

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
// RENDER PRODUCTS
// ==========================================

function renderProducts() {

    loadProducts();


    if (!productTableBody) {
        return;
    }


    const search =
        searchProduct
            ? searchProduct.value
                .toLowerCase()
                .trim()
            : "";


    const selectedCategory =
        categoryFilter
            ? categoryFilter.value
            : "all";


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


            const matchesSearch =
                name.includes(search) ||
                sku.includes(search) ||
                barcode.includes(search);


            const matchesCategory =
                selectedCategory === "all" ||
                product.category === selectedCategory;


            return (
                matchesSearch &&
                matchesCategory
            );

        });


    productTableBody.innerHTML = "";


    if (
        emptyProducts &&
        filteredProducts.length === 0
    ) {

        emptyProducts.style.display =
            "block";

    } else if (emptyProducts) {

        emptyProducts.style.display =
            "none";

    }


    filteredProducts.forEach(product => {

        const status =
            getProductStatus(product);


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>

                <div class="product-name-cell">

                    <div class="product-image-small">
                        🪵
                    </div>

                    <div>

                        <div class="product-name">

                            ${escapeHTML(
                                product.name ||
                                "Unnamed Product"
                            )}

                        </div>

                        <div class="product-sku">

                            ${escapeHTML(
                                product.barcode ||
                                "No barcode"
                            )}

                        </div>

                    </div>

                </div>

            </td>


            <td>

                ${escapeHTML(
                    product.sku || "-"
                )}

            </td>


            <td>

                <div class="category-name">

                    ${escapeHTML(
                        product.category || "-"
                    )}

                </div>

            </td>


            <td>

                ${escapeHTML(
                    product.unit || "Piece"
                )}

            </td>


            <td class="price">

                ${currency(
                    product.price
                )}

            </td>


            <td class="stock-number">

                ${Number(
                    product.stock || 0
                )}

            </td>


            <td>

                <span
                    class="status ${status.className}"
                >

                    ${status.text}

                </span>

            </td>


            <td>

                <div class="action-buttons">

                    <button
                        type="button"
                        class="action-button edit"
                        onclick="editProduct('${product.id}')"
                        title="Edit Product"
                    >

                        ✏️

                    </button>


                    <button
                        type="button"
                        class="action-button delete"
                        onclick="deleteProduct('${product.id}')"
                        title="Delete Product"
                    >

                        🗑️

                    </button>

                </div>

            </td>

        `;


        productTableBody.appendChild(
            row
        );

    });


    updateSummary();

}


// ==========================================
// UPDATE SUMMARY
// ==========================================

function updateSummary() {

    const total =
        products.length;


    const woodenPoles =
        products.filter(
            product =>
                product.category ===
                "Wooden Poles"
        ).length;


    const endCups =
        products.filter(
            product =>
                product.category ===
                "End Cups"
        ).length;


    const brackets =
        products.filter(
            product =>
                product.category ===
                "Brackets"
        ).length;


    const fullSets =
        products.filter(
            product =>
                product.category ===
                "Wood & Poles Full Set"
        ).length;


    const totalElement =
        document.getElementById(
            "productTotal"
        );


    const polesElement =
        document.getElementById(
            "woodenPolesCount"
        );


    const cupsElement =
        document.getElementById(
            "endCupsCount"
        );


    const bracketsElement =
        document.getElementById(
            "bracketsCount"
        );


    const fullSetsElement =
        document.getElementById(
            "fullSetsCount"
        );


    if (totalElement) {

        totalElement.textContent =
            total;

    }


    if (polesElement) {

        polesElement.textContent =
            woodenPoles;

    }


    if (cupsElement) {

        cupsElement.textContent =
            endCups;

    }


    if (bracketsElement) {

        bracketsElement.textContent =
            brackets;

    }


    if (fullSetsElement) {

        fullSetsElement.textContent =
            fullSets;

    }

}


// ==========================================
// OPEN ADD PRODUCT
// ==========================================

function openAddProduct() {

    editingProductId =
        null;


    const title =
        document.getElementById(
            "productModalTitle"
        );


    if (title) {

        title.textContent =
            "Add Product";

    }


    if (productForm) {

        productForm.reset();

    }


    const stockInput =
        document.getElementById(
            "productStock"
        );


    const minimumStockInput =
        document.getElementById(
            "productMinimumStock"
        );


    if (stockInput) {

        stockInput.value =
            0;

    }


    if (minimumStockInput) {

        minimumStockInput.value =
            5;

    }


    if (productModal) {

        productModal.classList.add(
            "show"
        );

    }

}


// ==========================================
// CLOSE MODAL
// ==========================================

function closeProductModal() {

    if (productModal) {

        productModal.classList.remove(
            "show"
        );

    }


    editingProductId =
        null;

}


// ==========================================
// SAVE PRODUCT
// ==========================================

if (productForm) {

    productForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const name =
                document.getElementById(
                    "productName"
                ).value.trim();


            const sku =
                document.getElementById(
                    "productSKU"
                ).value.trim();


            const barcode =
                document.getElementById(
                    "productBarcode"
                ).value.trim();


            const category =
                document.getElementById(
                    "productCategory"
                ).value;


            const description =
                document.getElementById(
                    "productDescription"
                ).value.trim();


            const price =
                Number(
                    document.getElementById(
                        "productPrice"
                    ).value
                );


            const cost =
                Number(
                    document.getElementById(
                        "productCost"
                    ).value || 0
                );


            const stock =
                Number(
                    document.getElementById(
                        "productStock"
                    ).value || 0
                );


            const minimumStock =
                Number(
                    document.getElementById(
                        "productMinimumStock"
                    ).value || 5
                );


            const unit =
                document.getElementById(
                    "productUnit"
                ).value;


            // ==================================
            // VALIDATION
            // ==================================

            if (!name) {

                alert(
                    "Please enter the product name."
                );

                return;

            }


            if (!sku) {

                alert(
                    "Please enter the SKU."
                );

                return;

            }


            if (!category) {

                alert(
                    "Please select a category."
                );

                return;

            }


            if (price <= 0) {

                alert(
                    "Please enter a valid selling price."
                );

                return;

            }


            if (stock < 0) {

                alert(
                    "Stock cannot be negative."
                );

                return;

            }


            // ==================================
            // PRODUCT DATA
            // ==================================

            const productData = {

                name:
                    name,

                sku:
                    sku,

                barcode:
                    barcode,

                category:
                    category,

                description:
                    description,

                price:
                    price,

                cost:
                    cost,

                stock:
                    stock,

                minimumStock:
                    minimumStock,

                unit:
                    unit

            };


            // ==================================
            // EDIT PRODUCT
            // ==================================

            if (
                editingProductId !== null
            ) {

                const index =
                    products.findIndex(
                        product =>
                            String(
                                product.id
                            ) ===
                            String(
                                editingProductId
                            )
                    );


                if (index !== -1) {

                    products[index] = {

                        ...products[index],

                        ...productData

                    };

                }

            }


            // ==================================
            // ADD PRODUCT
            // ==================================

            else {

                const newProduct = {

                    id:
                        Date.now(),

                    ...productData

                };


                products.push(
                    newProduct
                );

            }


            saveProducts();

            renderProducts();

            closeProductModal();

        }
    );

}


// ==========================================
// EDIT PRODUCT
// ==========================================

function editProduct(id) {

    loadProducts();


    const product =
        products.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!product) {

        alert(
            "Product not found."
        );

        return;

    }


    editingProductId =
        id;


    const title =
        document.getElementById(
            "productModalTitle"
        );


    if (title) {

        title.textContent =
            "Edit Product";

    }


    const nameInput =
        document.getElementById(
            "productName"
        );


    if (nameInput) {

        nameInput.value =
            product.name || "";

    }


    const skuInput =
        document.getElementById(
            "productSKU"
        );


    if (skuInput) {

        skuInput.value =
            product.sku || "";

    }


    const barcodeInput =
        document.getElementById(
            "productBarcode"
        );


    if (barcodeInput) {

        barcodeInput.value =
            product.barcode || "";

    }


    const categoryInput =
        document.getElementById(
            "productCategory"
        );


    if (categoryInput) {

        categoryInput.value =
            product.category || "";

    }


    const descriptionInput =
        document.getElementById(
            "productDescription"
        );


    if (descriptionInput) {

        descriptionInput.value =
            product.description || "";

    }


    const priceInput =
        document.getElementById(
            "productPrice"
        );


    if (priceInput) {

        priceInput.value =
            product.price || 0;

    }


    const costInput =
        document.getElementById(
            "productCost"
        );


    if (costInput) {

        costInput.value =
            product.cost || 0;

    }


    const stockInput =
        document.getElementById(
            "productStock"
        );


    if (stockInput) {

        stockInput.value =
            product.stock || 0;

    }


    const minimumStockInput =
        document.getElementById(
            "productMinimumStock"
        );


    if (minimumStockInput) {

        minimumStockInput.value =
            product.minimumStock ?? 5;

    }


    const unitInput =
        document.getElementById(
            "productUnit"
        );


    if (unitInput) {

        unitInput.value =
            product.unit || "Piece";

    }


    if (productModal) {

        productModal.classList.add(
            "show"
        );

    }

}


// ==========================================
// DELETE PRODUCT
// ==========================================

function deleteProduct(id) {

    loadProducts();


    const product =
        products.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!product) {

        return;

    }


    const confirmed =
        confirm(
            `Delete "${product.name}"?`
        );


    if (!confirmed) {

        return;

    }


    products =
        products.filter(
            item =>
                String(item.id) !==
                String(id)
        );


    saveProducts();

    renderProducts();

}


// ==========================================
// SEARCH
// ==========================================

if (searchProduct) {

    searchProduct.addEventListener(
        "input",
        renderProducts
    );

}


// ==========================================
// CATEGORY FILTER
// ==========================================

if (categoryFilter) {

    categoryFilter.addEventListener(
        "change",
        renderProducts
    );

}


// ==========================================
// ADD PRODUCT
// ==========================================

const addProductButton =
    document.getElementById(
        "addProductButton"
    );


if (addProductButton) {

    addProductButton.addEventListener(
        "click",
        openAddProduct
    );

}


// ==========================================
// EMPTY ADD PRODUCT
// ==========================================

const emptyAddButton =
    document.getElementById(
        "emptyAddProductButton"
    );


if (emptyAddButton) {

    emptyAddButton.addEventListener(
        "click",
        openAddProduct
    );

}


// ==========================================
// CLOSE MODAL
// ==========================================

const closeModalButton =
    document.getElementById(
        "closeProductModal"
    );


if (closeModalButton) {

    closeModalButton.addEventListener(
        "click",
        closeProductModal
    );

}


// ==========================================
// CANCEL
// ==========================================

const cancelProductButton =
    document.getElementById(
        "cancelProduct"
    );


if (cancelProductButton) {

    cancelProductButton.addEventListener(
        "click",
        closeProductModal
    );

}


// ==========================================
// CLICK OUTSIDE MODAL
// ==========================================

if (productModal) {

    productModal.addEventListener(
        "click",
        function(event) {

            if (
                event.target ===
                productModal
            ) {

                closeProductModal();

            }

        }
    );

}


// ==========================================
// ESC KEY
// ==========================================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape"
        ) {

            closeProductModal();

        }

    }
);


// ==========================================
// START
// ==========================================

renderProducts();


console.log(
    "Wood & Curtain POS - Products loaded."
);

console.log(
    "Categories:",
    categories
);
