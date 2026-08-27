// ============================================================
// WOOD & CURTAIN POS
// CENTRAL STORAGE
// ============================================================

const POS_STORAGE = {

    PRODUCTS: "woodCurtainProducts",

    SALES: "woodCurtainSales",

    CUSTOMERS: "woodCurtainCustomers",

    SETTINGS: "woodCurtainSettings"

};


// ============================================================
// PRODUCTS
// ============================================================

function getProducts() {

    return JSON.parse(
        localStorage.getItem(
            POS_STORAGE.PRODUCTS
        )
    ) || [];

}


function saveProducts(products) {

    localStorage.setItem(
        POS_STORAGE.PRODUCTS,
        JSON.stringify(products)
    );

}


// ============================================================
// SALES
// ============================================================

function getSales() {

    return JSON.parse(
        localStorage.getItem(
            POS_STORAGE.SALES
        )
    ) || [];

}


function saveSales(sales) {

    localStorage.setItem(
        POS_STORAGE.SALES,
        JSON.stringify(sales)
    );

}


// ============================================================
// CUSTOMERS
// ============================================================

function getCustomers() {

    return JSON.parse(
        localStorage.getItem(
            POS_STORAGE.CUSTOMERS
        )
    ) || [];

}


function saveCustomers(customers) {

    localStorage.setItem(
        POS_STORAGE.CUSTOMERS,
        JSON.stringify(customers)
    );

}


// ============================================================
// SETTINGS
// ============================================================

function getSettings() {

    const defaults = {

        businessName:
            "Wood & Curtain",

        businessPhone:
            "",

        currency:
            "Rs.",

        invoicePrefix:
            "INV",

        minimumStock:
            5

    };


    const saved =
        JSON.parse(
            localStorage.getItem(
                POS_STORAGE.SETTINGS
            )
        ) || {};


    return {

        ...defaults,

        ...saved

    };

}


// ============================================================
// MONEY
// ============================================================

function formatMoney(
    amount
) {

    const settings =
        getSettings();


    return (
        settings.currency ||
        "Rs."
    ) +
    " " +
    Number(
        amount || 0
    ).toLocaleString(
        "en-LK",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );

}


// ============================================================
// TODAY
// ============================================================

function isToday(date) {

    const d =
        new Date(date);

    const today =
        new Date();


    return (

        d.getFullYear() ===
        today.getFullYear()

        &&

        d.getMonth() ===
        today.getMonth()

        &&

        d.getDate() ===
        today.getDate()

    );

}


// ============================================================
// STOCK STATUS
// ============================================================

function getProductStockStatus(
    product
) {

    const settings =
        getSettings();


    const stock =
        Number(
            product.stock || 0
        );


    const minimum =
        Number(
            product.minimumStock ??
            settings.minimumStock ??
            5
        );


    if (stock <= 0) {

        return "out";

    }


    if (stock <= minimum) {

        return "low";

    }


    return "good";

}
