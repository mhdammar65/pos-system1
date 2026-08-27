// ======================================================
// WOOD & CURTAIN POS
// INVENTORY SYSTEM
// ======================================================

// ======================================================
// STORAGE
// ======================================================

const STORAGE_KEY = "woodCurtainProducts";

let products = [];


// ======================================================
// ELEMENTS
// ======================================================

const tableBody =
    document.getElementById("inventoryTableBody");

const empty =
    document.getElementById("inventoryEmpty");

const search =
    document.getElementById("inventorySearch");

const category =
    document.getElementById("inventoryCategory");

const stockFilter =
    document.getElementById("stockFilter");

const modal =
    document.getElementById("stockModal");

const stockProduct =
    document.getElementById("stockProduct");

const stockForm =
    document.getElementById("stockForm");

const stockButton =
    document.getElementById("stockButton");

const closeStockModalButton =
    document.getElementById("closeStockModal");

const cancelStockButton =
    document.getElementById("cancelStock");


// ======================================================
// LOAD PRODUCTS
// ======================================================

function loadProducts() {

    try {

        products =
            JSON.parse(
                localStorage.getItem(STORAGE_KEY)
            ) || [];

        if (!Array.isArray(products)) {

            products = [];

        }

    } catch (error) {

        console.error(
            "Could not load products:",
            error
        );

        products = [];

    }

}


// ======================================================
// SAVE PRODUCTS
// ======================================================

function saveProducts() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(products)
    );

}


// ======================================================
// FORMAT MONEY
// ======================================================

function formatMoney(value) {

    return Number(value || 0).toLocaleString(
        "en-LK",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );

}


// ======================================================
// STOCK STATUS
// ======================================================

function getStockStatus(product) {

    const stock =
        Number(product.stock || 0);

    const minimumStock =
        Number(product.minimumStock || 5);


    if (stock <= 0) {

        return "out";

    }


    if (stock <= minimumStock) {

        return "low";

    }


    return "good";

}


// ======================================================
// CATEGORY NORMALIZATION
// ======================================================

function normalizeCategory(categoryName) {

    const value =
        String(categoryName || "")
            .trim()
            .toLowerCase();


    // OLD CATEGORY → NEW CATEGORY

    if (
        value === "wood rod holder" ||
        value === "wooden pole" ||
        value === "wooden poles"
    ) {

        return "Wooden Poles";

    }


    if (
        value === "curtain" ||
        value === "end cup" ||
        value === "end cups"
    ) {

        return "End Cups";

    }


    if (
        value === "bracket" ||
        value === "brackets"
    ) {

        return "Brackets";

    }


    if (
        value === "western teak" ||
        value ===
            "western teak wooden curtain bar / rod / pole" ||
        value === "wooden bar" ||
        value === "wooden and poles full set" ||
        value === "wooden & poles full set"
    ) {

        return "Wooden & Poles Full Set";

    }


    return categoryName || "Uncategorized";

}


// ======================================================
// RENDER INVENTORY
// ======================================================

function renderInventory() {

    loadProducts();


    const searchText =
        String(search.value || "")
            .toLowerCase()
            .trim();


    const selectedCategory =
        category.value;


    const selectedStock =
        stockFilter.value;


    const filteredProducts =
        products.filter(product => {

            const productName =
                String(product.name || "")
                    .toLowerCase();


            const productSKU =
                String(product.sku || "")
                    .toLowerCase();


            const productBarcode =
                String(product.barcode || "")
                    .toLowerCase();


            const productCategory =
                normalizeCategory(
                    product.category
                );


            // SEARCH

            const matchesSearch =
                productName.includes(searchText) ||
                productSKU.includes(searchText) ||
                productBarcode.includes(searchText);


            // CATEGORY

            const matchesCategory =
                selectedCategory === "all" ||
                productCategory === selectedCategory;


            // STOCK

            const status =
                getStockStatus(product);


            let matchesStock = true;


            if (selectedStock === "in") {

                matchesStock =
                    status === "good";

            }


            if (selectedStock === "low") {

                matchesStock =
                    status === "low";

            }


            if (selectedStock === "out") {

                matchesStock =
                    status === "out";

            }


            return (
                matchesSearch &&
                matchesCategory &&
                matchesStock
            );

        });


    // CLEAR TABLE

    tableBody.innerHTML = "";


    // EMPTY STATE

    if (filteredProducts.length === 0) {

        empty.style.display = "block";

    } else {

        empty.style.display = "none";

    }


    // CREATE ROWS

    filteredProducts.forEach(product => {

        const row =
            document.createElement("tr");


        const stock =
            Number(product.stock || 0);


        const status =
            getStockStatus(product);


        let statusText =
            "In Stock";

        let stockClass =
            "stock-good";


        if (status === "low") {

            statusText =
                "Low Stock";

            stockClass =
                "stock-low";

        }


        if (status === "out") {

            statusText =
                "Out of Stock";

            stockClass =
                "stock-out";

        }


        const productCategory =
            normalizeCategory(
                product.category
            );


        row.innerHTML = `

            <td>

                <div class="inventory-product">

                    <div class="inventory-product-image">
                        🪵
                    </div>

                    <div>

                        <strong>
                            ${escapeHTML(
                                product.name ||
                                "Unnamed Product"
                            )}
                        </strong>

                        <small>
                            ${escapeHTML(
                                product.description ||
                                ""
                            )}
                        </small>

                    </div>

                </div>

            </td>


            <td>

                <span class="inventory-sku">

                    ${escapeHTML(
                        product.sku || "-"
                    )}

                </span>

            </td>


            <td>

                <span class="inventory-category">

                    ${escapeHTML(
                        productCategory
                    )}

                </span>

            </td>


            <td>

                <span
                    class="inventory-stock ${stockClass}"
                >

                    ${stock}

                </span>

            </td>


            <td>

                ${escapeHTML(
                    product.unit || "Piece"
                )}

            </td>


            <td>

                Rs.
                ${formatMoney(
                    product.price
                )}

            </td>


            <td>

                <span
                    class="status ${status}"
                >

                    ${statusText}

                </span>

            </td>


            <td>

                <button
                    type="button"
                    class="inventory-adjust"
                    onclick="openAdjustment('${escapeHTML(
                        product.id
                    )}')"
                >

                    Adjust

                </button>

            </td>

        `;


        tableBody.appendChild(row);

    });


    updateStats();

}


// ======================================================
// UPDATE STATISTICS
// ======================================================

function updateStats() {

    const total =
        products.length;


    const inStock =
        products.filter(
            product =>
                getStockStatus(product) ===
                "good"
        ).length;


    const lowStock =
        products.filter(
            product =>
                getStockStatus(product) ===
                "low"
        ).length;


    const outStock =
        products.filter(
            product =>
                getStockStatus(product) ===
                "out"
        ).length;


    const totalElement =
        document.getElementById(
            "inventoryTotalProducts"
        );


    const inStockElement =
        document.getElementById(
            "inventoryInStock"
        );


    const lowStockElement =
        document.getElementById(
            "inventoryLowStock"
        );


    const outStockElement =
        document.getElementById(
            "inventoryOutStock"
        );


    if (totalElement) {

        totalElement.textContent =
            total;

    }


    if (inStockElement) {

        inStockElement.textContent =
            inStock;

    }


    if (lowStockElement) {

        lowStockElement.textContent =
            lowStock;

    }


    if (outStockElement) {

        outStockElement.textContent =
            outStock;

    }

}


// ======================================================
// POPULATE PRODUCT SELECT
// ======================================================

function populateProductSelect() {

    loadProducts();


    stockProduct.innerHTML = "";


    if (products.length === 0) {

        stockProduct.innerHTML = `

            <option value="">
                No products available
            </option>

        `;

        return;

    }


    products.forEach(product => {

        const option =
            document.createElement("option");


        option.value =
            product.id;


        option.textContent =
            `${product.name || "Unnamed Product"} — ${
                normalizeCategory(product.category)
            } — Stock: ${
                Number(product.stock || 0)
            }`;


        stockProduct.appendChild(
            option
        );

    });

}


// ======================================================
// OPEN STOCK MODAL
// ======================================================

function openStockModal() {

    stockForm.reset();

    populateProductSelect();

    modal.classList.add("show");

}


// ======================================================
// OPEN ADJUSTMENT
// ======================================================

function openAdjustment(id) {

    populateProductSelect();


    stockProduct.value =
        String(id);


    document.getElementById(
        "stockType"
    ).value = "add";


    document.getElementById(
        "stockQuantity"
    ).value = "";


    document.getElementById(
        "stockNote"
    ).value = "";


    modal.classList.add("show");

}


// ======================================================
// CLOSE MODAL
// ======================================================

function closeStockModal() {

    modal.classList.remove(
        "show"
    );

}


// ======================================================
// STOCK ADJUSTMENT
// ======================================================

function handleStockAdjustment(event) {

    event.preventDefault();


    const productId =
        stockProduct.value;


    const type =
        document.getElementById(
            "stockType"
        ).value;


    const quantity =
        Number(
            document.getElementById(
                "stockQuantity"
            ).value
        );


    const note =
        document.getElementById(
            "stockNote"
        ).value.trim();


    // VALIDATION

    if (
        !productId ||
        !Number.isFinite(quantity) ||
        quantity <= 0
    ) {

        alert(
            "Please enter a valid quantity."
        );

        return;

    }


    // FIND PRODUCT

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


    const currentStock =
        Number(product.stock || 0);


    // REMOVE VALIDATION

    if (
        type === "remove" &&
        quantity > currentStock
    ) {

        alert(
            `Cannot remove ${quantity}. Available stock is ${currentStock}.`
        );

        return;

    }


    // UPDATE STOCK

    if (type === "add") {

        product.stock =
            currentStock +
            quantity;

    } else {

        product.stock =
            currentStock -
            quantity;

    }


    // STOCK HISTORY

    if (
        !Array.isArray(
            product.stockHistory
        )
    ) {

        product.stockHistory = [];

    }


    product.stockHistory.push({

        type:
            type,

        quantity:
            quantity,

        note:
            note,

        date:
            new Date().toISOString(),

        balance:
            product.stock

    });


    // SAVE

    saveProducts();


    // REFRESH

    renderInventory();


    closeStockModal();


    alert(
        `${product.name || "Product"} stock updated successfully.`
    );

}


// ======================================================
// SEARCH
// ======================================================

if (search) {

    search.addEventListener(
        "input",
        renderInventory
    );

}


// ======================================================
// CATEGORY FILTER
// ======================================================

if (category) {

    category.addEventListener(
        "change",
        renderInventory
    );

}


// ======================================================
// STOCK FILTER
// ======================================================

if (stockFilter) {

    stockFilter.addEventListener(
        "change",
        renderInventory
    );

}


// ======================================================
// STOCK BUTTON
// ======================================================

if (stockButton) {

    stockButton.addEventListener(
        "click",
        openStockModal
    );

}


// ======================================================
// CLOSE BUTTON
// ======================================================

if (closeStockModalButton) {

    closeStockModalButton.addEventListener(
        "click",
        closeStockModal
    );

}


// ======================================================
// CANCEL BUTTON
// ======================================================

if (cancelStockButton) {

    cancelStockButton.addEventListener(
        "click",
        closeStockModal
    );

}


// ======================================================
// FORM SUBMIT
// ======================================================

if (stockForm) {

    stockForm.addEventListener(
        "submit",
        handleStockAdjustment
    );

}


// ======================================================
// CLICK OUTSIDE MODAL
// ======================================================

if (modal) {

    modal.addEventListener(
        "click",
        function(event) {

            if (
                event.target === modal
            ) {

                closeStockModal();

            }

        }
    );

}


// ======================================================
// ESCAPE KEY
// ======================================================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape" &&
            modal.classList.contains("show")
        ) {

            closeStockModal();

        }

    }
);


// ======================================================
// SECURITY
// ======================================================

function escapeHTML(value) {

    return String(value ?? "")
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


// ======================================================
// START INVENTORY
// ======================================================

loadProducts();

renderInventory();
