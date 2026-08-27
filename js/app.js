// ==========================================
// WOOD & CURTAIN POS
// Main Application JavaScript
// ==========================================


// ------------------------------------------
// PRODUCT CATEGORIES
// ------------------------------------------

const categories = [

    {
        id: 1,
        name: "Wood Rod Holder"
    },

    {
        id: 2,
        name: "Curtain"
    },

    {
        id: 3,
        name: "Western Teak Wooden Curtain Bar / Rod / Pole"
    },

    {
        id: 4,
        name: "Curtain Wooden Bar - 10 Feet / 120 Inch"
    }

];


// ------------------------------------------
// SAMPLE PRODUCTS
// ------------------------------------------

const products = [

    {
        id: 1,

        name: "Wood Rod Holder",

        categoryId: 1,

        sku: "WRH-001",

        unit: "Piece",

        price: 450,

        cost: 250,

        stock: 100,

        minimumStock: 10
    },


    {
        id: 2,

        name: "Western Teak Wooden Curtain Rod",

        categoryId: 3,

        sku: "WTR-001",

        unit: "Piece",

        length: "120 Inch",

        price: 5000,

        cost: 3500,

        stock: 25,

        minimumStock: 5
    },


    {
        id: 3,

        name: "Curtain Wooden Bar",

        categoryId: 4,

        sku: "CWB-001",

        unit: "Piece",

        length: "10 Feet / 120 Inch",

        price: 4500,

        cost: 3000,

        stock: 40,

        minimumStock: 5
    }

];


// ------------------------------------------
// SAMPLE SALES
// ------------------------------------------

const sales = [];


// ------------------------------------------
// UPDATE DASHBOARD
// ------------------------------------------

function updateDashboard() {

    // Total products

    const totalProducts =
        products.length;


    // Low stock products

    const lowStockProducts =
        products.filter(product => {

            return product.stock <=
                   product.minimumStock;

        });


    // Update product count

    document.getElementById(
        "totalProducts"
    ).textContent =
        totalProducts;


    // Update low stock count

    document.getElementById(
        "lowStock"
    ).textContent =
        lowStockProducts.length;


    // Today's sales

    const todaySales =
        sales.reduce(
            (total, sale) =>
                total + sale.total,
            0
        );


    document.getElementById(
        "todaySales"
    ).textContent =
        formatCurrency(todaySales);


    // Today's orders

    document.getElementById(
        "todayOrders"
    ).textContent =
        sales.length;

}


// ------------------------------------------
// CURRENCY FORMAT
// ------------------------------------------

function formatCurrency(amount) {

    return "Rs. " +
        Number(amount)
            .toLocaleString(
                "en-LK",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            );

}


// ------------------------------------------
// CATEGORY CLICK
// ------------------------------------------

const categoryCards =
    document.querySelectorAll(
        ".category-card"
    );


categoryCards.forEach(card => {

    card.addEventListener(
        "click",
        function() {

            const category =
                this.dataset.category;

            console.log(
                "Selected category:",
                category
            );

            alert(
                "Category selected: " +
                category
            );

        }
    );

});


// ------------------------------------------
// NEW SALE BUTTON
// ------------------------------------------

const newSaleButton =
    document.getElementById(
        "newSaleButton"
    );


newSaleButton.addEventListener(
    "click",
    function() {

        alert(
            "POS Sales screen will open here."
        );

    }
);


// ------------------------------------------
// NAVIGATION BUTTONS
// ------------------------------------------

const navItems =
    document.querySelectorAll(
        ".nav-item"
    );


navItems.forEach(item => {

    item.addEventListener(
        "click",
        function() {

            navItems.forEach(
                nav =>
                    nav.classList.remove(
                        "active"
                    )
            );

            this.classList.add(
                "active"
            );

            console.log(
                "Navigation:",
                this.textContent.trim()
            );

        }
    );

});


// ------------------------------------------
// START APPLICATION
// ------------------------------------------

updateDashboard();

console.log(
    "Wood & Curtain POS started."
);

console.log(
    "Categories:",
    categories
);

console.log(
    "Products:",
    products
);
