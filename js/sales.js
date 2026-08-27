// ==========================================
// SALES HISTORY
// ==========================================

let sales = JSON.parse(
    localStorage.getItem("woodCurtainSales")
) || [];


// ==========================================
// ELEMENTS
// ==========================================

const tableBody = document.getElementById("salesTableBody");
const empty = document.getElementById("salesEmpty");

const search = document.getElementById("salesSearch");
const dateFilter = document.getElementById("dateFilter");
const paymentFilter = document.getElementById("paymentFilter");

const modal = document.getElementById("saleModal");
const invoiceContent = document.getElementById("invoiceContent");


// ==========================================
// CURRENCY
// ==========================================

function currency(value) {

    return "Rs. " + Number(value || 0).toLocaleString("en-LK", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

}


// ==========================================
// DATE
// ==========================================

function formatDate(dateValue) {

    if (!dateValue) {
        return "-";
    }

    const date = new Date(dateValue);

    if (isNaN(date.getTime())) {
        return "-";
    }

    return date.toLocaleDateString("en-LK", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });

}


function formatTime(dateValue) {

    if (!dateValue) {
        return "";
    }

    const date = new Date(dateValue);

    if (isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleTimeString("en-LK", {
        hour: "2-digit",
        minute: "2-digit"
    });

}


// ==========================================
// GET SALE ID
// ==========================================

function getSaleId(sale, index) {

    return sale.id ||
           sale.saleId ||
           sale.invoice ||
           sale.invoiceNumber ||
           index;

}


// ==========================================
// GET INVOICE
// ==========================================

function getInvoice(sale, index) {

    return sale.invoice ||
           sale.invoiceNumber ||
           sale.id ||
           `INV-${String(index + 1).padStart(6, "0")}`;

}


// ==========================================
// GET ITEMS
// ==========================================

function getItems(sale) {

    if (Array.isArray(sale.items)) {
        return sale.items;
    }

    if (Array.isArray(sale.cart)) {
        return sale.cart;
    }

    if (Array.isArray(sale.products)) {
        return sale.products;
    }

    return [];

}


// ==========================================
// GET TOTAL
// ==========================================

function getTotal(sale) {

    if (sale.total !== undefined) {
        return Number(sale.total);
    }

    if (sale.grandTotal !== undefined) {
        return Number(sale.grandTotal);
    }

    if (sale.amount !== undefined) {
        return Number(sale.amount);
    }

    return 0;

}


// ==========================================
// GET PAYMENT
// ==========================================

function getPayment(sale) {

    return sale.paymentMethod ||
           sale.payment ||
           sale.method ||
           "Cash";

}


// ==========================================
// FILTER
// ==========================================

function getFilteredSales() {

    const searchText = search.value
        .toLowerCase()
        .trim();

    const selectedDate = dateFilter.value;

    const selectedPayment = paymentFilter.value;


    return sales.filter((sale, index) => {

        const invoice = getInvoice(
            sale,
            index
        );


        const customer =
            sale.customer ||
            sale.customerName ||
            "Walk-in Customer";


        const matchesSearch =
            invoice
                .toString()
                .toLowerCase()
                .includes(searchText)

            ||

            customer
                .toString()
                .toLowerCase()
                .includes(searchText);


        let matchesDate = true;


        if (selectedDate) {

            const dateValue =
                sale.date ||
                sale.createdAt ||
                sale.timestamp;


            if (dateValue) {

                const saleDate =
                    new Date(dateValue)
                        .toISOString()
                        .split("T")[0];

                matchesDate =
                    saleDate === selectedDate;

            } else {

                matchesDate = false;

            }

        }


        let matchesPayment = true;


        if (selectedPayment !== "all") {

            matchesPayment =
                getPayment(sale) ===
                selectedPayment;

        }


        return (
            matchesSearch &&
            matchesDate &&
            matchesPayment
        );

    });

}


// ==========================================
// RENDER SALES
// ==========================================

function renderSales() {

    // Reload latest data

    sales = JSON.parse(
        localStorage.getItem("woodCurtainSales")
    ) || [];


    const filteredSales =
        getFilteredSales();


    tableBody.innerHTML = "";


    if (filteredSales.length === 0) {

        empty.style.display = "block";

    } else {

        empty.style.display = "none";

    }


    filteredSales
        .slice()
        .reverse()
        .forEach((sale) => {

            const originalIndex =
                sales.indexOf(sale);


            const row =
                document.createElement("tr");


            const items =
                getItems(sale);


            const itemCount =
                items.reduce(
                    (total, item) =>
                        total +
                        Number(
                            item.quantity ||
                            item.qty ||
                            1
                        ),
                    0
                );


            const payment =
                getPayment(sale);


            const paymentClass =
                payment
                    .toLowerCase()
                    .replace(/\s+/g, "-");


            const total =
                getTotal(sale);


            const customer =
                sale.customer ||
                sale.customerName ||
                "Walk-in Customer";


            const saleDate =
                sale.date ||
                sale.createdAt ||
                sale.timestamp;


            const saleId =
                getSaleId(
                    sale,
                    originalIndex
                );


            row.innerHTML = `

                <td>

                    <span class="invoice-number">

                        ${getInvoice(
                            sale,
                            originalIndex
                        )}

                    </span>

                </td>


                <td>

                    <div class="date-cell">

                        <strong>

                            ${formatDate(
                                saleDate
                            )}

                        </strong>

                        <small>

                            ${formatTime(
                                saleDate
                            )}

                        </small>

                    </div>

                </td>


                <td>

                    <span class="customer-cell">

                        ${customer}

                    </span>

                </td>


                <td>

                    <span class="items-count">

                        ${itemCount}
                        ${itemCount === 1
                            ? " item"
                            : " items"}

                    </span>

                </td>


                <td>

                    <span
                        class="payment-badge ${paymentClass}">

                        ${payment}

                    </span>

                </td>


                <td>

                    <span class="sale-total">

                        ${currency(total)}

                    </span>

                </td>


                <td>

                    <button
                        class="view-sale"
                        data-sale-id="${saleId}">

                        👁 View

                    </button>

                </td>

            `;


            const viewButton =
                row.querySelector(
                    ".view-sale"
                );


            viewButton.addEventListener(
                "click",
                function() {

                    viewSale(
                        saleId
                    );

                }
            );


            tableBody.appendChild(row);

        });


    updateStatistics();

}


// ==========================================
// STATISTICS
// ==========================================

function updateStatistics() {

    const totalOrders =
        sales.length;


    const totalSales =
        sales.reduce(
            (total, sale) =>
                total +
                getTotal(sale),
            0
        );


    const averageOrder =
        totalOrders > 0
            ? totalSales / totalOrders
            : 0;


    const cashSales =
        sales
            .filter(
                sale =>
                    getPayment(sale) ===
                    "Cash"
            )
            .reduce(
                (total, sale) =>
                    total +
                    getTotal(sale),
                0
            );


    document.getElementById(
        "totalOrders"
    ).textContent =
        totalOrders;


    document.getElementById(
        "totalSales"
    ).textContent =
        currency(totalSales);


    document.getElementById(
        "averageOrder"
    ).textContent =
        currency(averageOrder);


    document.getElementById(
        "cashSales"
    ).textContent =
        currency(cashSales);

}


// ==========================================
// VIEW SALE
// ==========================================

function viewSale(saleId) {

    sales = JSON.parse(
        localStorage.getItem("woodCurtainSales")
    ) || [];


    const sale =
        sales.find(
            (item, index) =>
                String(
                    getSaleId(
                        item,
                        index
                    )
                ) ===
                String(saleId)
        );


    if (!sale) {

        alert(
            "Sale could not be found."
        );

        return;

    }


    const saleIndex =
        sales.indexOf(sale);


    const invoice =
        getInvoice(
            sale,
            saleIndex
        );


    const items =
        getItems(sale);


    const subtotal =
        Number(
            sale.subtotal ||
            sale.subTotal ||
            getTotal(sale)
        );


    const discount =
        Number(
            sale.discount || 0
        );


    const total =
        getTotal(sale);


    const payment =
        getPayment(sale);


    const customer =
        sale.customer ||
        sale.customerName ||
        "Walk-in Customer";


    const saleDate =
        sale.date ||
        sale.createdAt ||
        sale.timestamp;


    document.getElementById(
        "modalInvoice"
    ).textContent =
        invoice;


    invoiceContent.innerHTML = `

        <div class="invoice-company">

            <h2>
                Wood & Curtain
            </h2>

            <p>
                POS Sales Invoice
            </p>

        </div>


        <div class="invoice-info-grid">

            <div class="invoice-info-box">

                <span>
                    Invoice
                </span>

                <strong>
                    ${invoice}
                </strong>

            </div>


            <div class="invoice-info-box">

                <span>
                    Date
                </span>

                <strong>

                    ${formatDate(
                        saleDate
                    )}

                    ${formatTime(
                        saleDate
                    )}

                </strong>

            </div>


            <div class="invoice-info-box">

                <span>
                    Customer
                </span>

                <strong>
                    ${customer}
                </strong>

            </div>


            <div class="invoice-info-box">

                <span>
                    Payment
                </span>

                <strong>
                    ${payment}
                </strong>

            </div>

        </div>


        <table class="invoice-items">

            <thead>

                <tr>

                    <th>
                        PRODUCT
                    </th>

                    <th>
                        QTY
                    </th>

                    <th>
                        PRICE
                    </th>

                    <th>
                        TOTAL
                    </th>

                </tr>

            </thead>


            <tbody>

                ${
                    items.length
                    ?

                    items.map(item => {

                        const quantity =
                            Number(
                                item.quantity ||
                                item.qty ||
                                1
                            );


                        const price =
                            Number(
                                item.price ||
                                item.unitPrice ||
                                0
                            );


                        const itemTotal =
                            Number(
                                item.total ||
                                itemTotalFallback(
                                    quantity,
                                    price
                                )
                            );


                        return `

                            <tr>

                                <td>
                                    ${item.name || "Product"}
                                </td>

                                <td>
                                    ${quantity}
                                </td>

                                <td>
                                    ${currency(price)}
                                </td>

                                <td>
                                    ${currency(itemTotal)}
                                </td>

                            </tr>

                        `;

                    }).join("")

                    :

                    `

                        <tr>

                            <td colspan="4">
                                No item details available
                            </td>

                        </tr>

                    `
                }

            </tbody>

        </table>


        <div class="invoice-totals">


            <div class="invoice-total-line">

                <span>
                    Subtotal
                </span>

                <strong>
                    ${currency(subtotal)}
                </strong>

            </div>


            <div class="invoice-total-line">

                <span>
                    Discount
                </span>

                <strong>
                    ${currency(discount)}
                </strong>

            </div>


            <div
                class="invoice-total-line invoice-grand-total">

                <span>
                    Total
                </span>

                <strong>
                    ${currency(total)}
                </strong>

            </div>


            ${
                payment === "Cash"
                ?

                `

                    <div class="invoice-total-line">

                        <span>
                            Cash Received
                        </span>

                        <strong>
                            ${currency(
                                sale.cashReceived ||
                                sale.cash ||
                                0
                            )}
                        </strong>

                    </div>


                    <div class="invoice-total-line">

                        <span>
                            Change
                        </span>

                        <strong>
                            ${currency(
                                sale.change ||
                                0
                            )}
                        </strong>

                    </div>

                `

                :

                ""
            }


        </div>

    `;


    modal.classList.add(
        "show"
    );

}


// ==========================================
// ITEM TOTAL FALLBACK
// ==========================================

function itemTotalFallback(
    quantity,
    price
) {

    return quantity * price;

}


// ==========================================
// SEARCH
// ==========================================

search.addEventListener(
    "input",
    renderSales
);


// ==========================================
// DATE
// ==========================================

dateFilter.addEventListener(
    "change",
    renderSales
);


// ==========================================
// PAYMENT
// ==========================================

paymentFilter.addEventListener(
    "change",
    renderSales
);


// ==========================================
// CLOSE MODAL
// ==========================================

function closeModal() {

    modal.classList.remove(
        "show"
    );

}


document.getElementById(
    "closeSaleModal"
).addEventListener(
    "click",
    closeModal
);


document.getElementById(
    "closeSale"
).addEventListener(
    "click",
    closeModal
);


// ==========================================
// PRINT
// ==========================================

document.getElementById(
    "printSale"
).addEventListener(
    "click",
    function() {

        window.print();

    }
);


// ==========================================
// ESC
// ==========================================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape"
        ) {

            closeModal();

        }

    }
);


// ==========================================
// START
// ==========================================

renderSales();
