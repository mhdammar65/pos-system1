// ============================================================
// WOOD & CURTAIN POS
// SALES HISTORY
// ============================================================


let sales =
    JSON.parse(
        localStorage.getItem(
            "woodCurtainSales"
        )
    ) || [];


// ============================================================
// ELEMENTS
// ============================================================

const tableBody =
    document.getElementById(
        "salesTableBody"
    );

const empty =
    document.getElementById(
        "salesEmpty"
    );

const search =
    document.getElementById(
        "salesSearch"
    );

const paymentFilter =
    document.getElementById(
        "paymentFilter"
    );

const dateFilter =
    document.getElementById(
        "dateFilter"
    );

const invoiceModal =
    document.getElementById(
        "invoiceModal"
    );

const invoiceContent =
    document.getElementById(
        "invoiceContent"
    );

const closeInvoiceModal =
    document.getElementById(
        "closeInvoiceModal"
    );

const invoiceDoneButton =
    document.getElementById(
        "invoiceDoneButton"
    );

const printInvoiceButton =
    document.getElementById(
        "printInvoiceButton"
    );


// ============================================================
// LOAD SALES
// ============================================================

function loadSales() {

    sales =
        JSON.parse(
            localStorage.getItem(
                "woodCurtainSales"
            )
        ) || [];

}


// ============================================================
// MONEY
// ============================================================

function money(value) {

    return (
        "Rs. " +
        Number(
            value || 0
        ).toLocaleString(
            "en-LK",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        )
    );

}


// ============================================================
// ESCAPE
// ============================================================

function escapeHTML(value) {

    return String(
        value ?? ""
    )
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


// ============================================================
// FILTER SALES
// ============================================================

function getFilteredSales() {

    const searchText =
        search.value
            .toLowerCase()
            .trim();


    const payment =
        paymentFilter.value;


    const date =
        dateFilter.value;


    const now =
        new Date();


    return sales.filter(
        sale => {

            const invoice =
                String(
                    sale.invoiceNumber ||
                    ""
                ).toLowerCase();


            const customer =
                String(
                    sale.customerName ||
                    ""
                ).toLowerCase();


            const matchesSearch =
                invoice.includes(
                    searchText
                ) ||
                customer.includes(
                    searchText
                );


            const matchesPayment =
                payment === "all" ||
                sale.paymentMethod ===
                    payment;


            let matchesDate = true;


            if (
                date !== "all"
            ) {

                const saleDate =
                    new Date(
                        sale.date
                    );


                if (
                    date === "today"
                ) {

                    matchesDate =
                        saleDate.toDateString() ===
                        now.toDateString();

                } else {

                    const days =
                        Number(
                            date
                        );


                    const difference =
                        now -
                        saleDate;


                    matchesDate =
                        difference <=
                        days *
                        24 *
                        60 *
                        60 *
                        1000;

                }

            }


            return (
                matchesSearch &&
                matchesPayment &&
                matchesDate
            );

        }
    );

}


// ============================================================
// RENDER
// ============================================================

function renderSales() {

    loadSales();


    const filtered =
        getFilteredSales();


    tableBody.innerHTML =
        "";


    if (
        filtered.length === 0
    ) {

        empty.style.display =
            "block";

    } else {

        empty.style.display =
            "none";

    }


    filtered.forEach(
        sale => {

            const row =
                document.createElement(
                    "tr"
                );


            const itemCount =
                sale.items
                    ? sale.items.reduce(
                        (
                            total,
                            item
                        ) =>
                            total +
                            Number(
                                item.quantity ||
                                0
                            ),
                        0
                    )
                    : 0;


            row.innerHTML = `

                <td>

                    <strong class="invoice-number">

                        ${escapeHTML(
                            sale.invoiceNumber ||
                            "-"
                        )}

                    </strong>

                </td>


                <td>

                    ${new Date(
                        sale.date
                    ).toLocaleDateString(
                        "en-LK"
                    )}

                    <small class="sale-time">

                        ${new Date(
                            sale.date
                        ).toLocaleTimeString(
                            "en-LK",
                            {
                                hour:
                                    "2-digit",
                                minute:
                                    "2-digit"
                            }
                        )}

                    </small>

                </td>


                <td>

                    <strong>

                        ${escapeHTML(
                            sale.customerName ||
                            "Walk-in Customer"
                        )}

                    </strong>


                    ${
                        sale.customerPhone
                            ? `
                                <small class="sale-phone">

                                    ${escapeHTML(
                                        sale.customerPhone
                                    )}

                                </small>
                            `
                            : ""
                    }

                </td>


                <td>

                    ${itemCount}

                </td>


                <td>

                    <span class="payment-badge">

                        ${escapeHTML(
                            sale.paymentMethod ||
                            "-"
                        )}

                    </span>

                </td>


                <td>

                    <strong>

                        ${money(
                            sale.total
                        )}

                    </strong>

                </td>


                <td>

                    <div class="sale-actions">

                        <button
                            onclick="viewInvoice(
                                '${sale.invoiceNumber}'
                            )"
                        >
                            View
                        </button>


                        <button
                            onclick="printInvoice(
                                '${sale.invoiceNumber}'
                            )"
                        >
                            Print
                        </button>

                    </div>

                </td>

            `;


            tableBody.appendChild(
                row
            );

        }
    );


    updateStatistics();

}


// ============================================================
// STATISTICS
// ============================================================

function updateStatistics() {

    const total =
        sales.reduce(
            (
                sum,
                sale
            ) =>
                sum +
                Number(
                    sale.total || 0
                ),
            0
        );


    const today =
        new Date();


    const todaySales =
        sales.filter(
            sale =>
                new Date(
                    sale.date
                ).toDateString() ===
                today.toDateString()
        );


    const todayTotal =
        todaySales.reduce(
            (
                sum,
                sale
            ) =>
                sum +
                Number(
                    sale.total || 0
                ),
            0
        );


    const average =
        sales.length > 0
            ? total / sales.length
            : 0;


    document.getElementById(
        "totalSales"
    ).textContent =
        money(total);


    document.getElementById(
        "todaySales"
    ).textContent =
        money(todayTotal);


    document.getElementById(
        "todayOrders"
    ).textContent =
        todaySales.length;


    document.getElementById(
        "averageOrder"
    ).textContent =
        money(average);

}


// ============================================================
// VIEW INVOICE
// ============================================================

function viewInvoice(
    invoiceNumber
) {

    loadSales();


    const sale =
        sales.find(
            item =>
                item.invoiceNumber ===
                invoiceNumber
        );


    if (!sale) {

        alert(
            "Invoice not found."
        );

        return;

    }


    const itemsHTML =
        sale.items
            .map(
                item => `

                    <tr>

                        <td>

                            ${escapeHTML(
                                item.name
                            )}

                            <small>

                                ${escapeHTML(
                                    item.unit ||
                                    "Piece"
                                )}

                            </small>

                        </td>


                        <td>

                            ${item.quantity}

                        </td>


                        <td>

                            ${money(
                                item.price
                            )}

                        </td>


                        <td>

                            ${money(
                                item.lineTotal
                            )}

                        </td>

                    </tr>

                `
            )
            .join("");


    invoiceContent.innerHTML = `

        <div class="invoice">

            <div class="invoice-top">

                <div>

                    <h1>
                        WOOD & CURTAIN
                    </h1>

                    <p>
                        POS SYSTEM
                    </p>

                </div>


                <div class="invoice-number-box">

                    <span>
                        INVOICE
                    </span>

                    <strong>
                        ${escapeHTML(
                            sale.invoiceNumber
                        )}
                    </strong>

                </div>

            </div>


            <div class="invoice-info">

                <div>

                    <span>
                        Customer
                    </span>

                    <strong>
                        ${escapeHTML(
                            sale.customerName ||
                            "Walk-in Customer"
                        )}
                    </strong>


                    ${
                        sale.customerPhone
                            ? `
                                <small>

                                    ${escapeHTML(
                                        sale.customerPhone
                                    )}

                                </small>
                            `
                            : ""
                    }

                </div>


                <div>

                    <span>
                        Date
                    </span>

                    <strong>

                        ${new Date(
                            sale.date
                        ).toLocaleString(
                            "en-LK"
                        )}

                    </strong>

                </div>

            </div>


            <table class="invoice-table">

                <thead>

                    <tr>

                        <th>
                            Product
                        </th>

                        <th>
                            Qty
                        </th>

                        <th>
                            Price
                        </th>

                        <th>
                            Total
                        </th>

                    </tr>

                </thead>


                <tbody>

                    ${itemsHTML}

                </tbody>

            </table>


            <div class="invoice-total-area">

                <div>

                    <span>
                        Subtotal
                    </span>

                    <strong>
                        ${money(
                            sale.subtotal
                        )}
                    </strong>

                </div>


                <div>

                    <span>
                        Discount
                    </span>

                    <strong>
                        ${money(
                            sale.discount
                        )}
                    </strong>

                </div>


                <div class="invoice-grand-total">

                    <span>
                        TOTAL
                    </span>

                    <strong>
                        ${money(
                            sale.total
                        )}
                    </strong>

                </div>

            </div>


            <div class="invoice-payment">

                <strong>
                    Payment:
                </strong>

                ${escapeHTML(
                    sale.paymentMethod ||
                    "-"
                )}


                ${
                    sale.paymentMethod ===
                    "Cash"
                        ? `
                            <br>

                            Cash Received:
                            ${money(
                                sale.cashReceived
                            )}

                            <br>

                            Change:
                            ${money(
                                sale.change
                            )}
                        `
                        : ""
                }

            </div>


            <div class="invoice-thank-you">

                Thank you for your business!

            </div>

        </div>

    `;


    invoiceModal.classList.add(
        "show"
    );


    printInvoiceButton.dataset.invoice =
        invoiceNumber;

}


// ============================================================
// CLOSE INVOICE
// ============================================================

function closeInvoice() {

    invoiceModal.classList.remove(
        "show"
    );

}


closeInvoiceModal.addEventListener(
    "click",
    closeInvoice
);


invoiceDoneButton.addEventListener(
    "click",
    closeInvoice
);


// ============================================================
// PRINT
// ============================================================

function printInvoice(
    invoiceNumber
) {

    loadSales();


    const sale =
        sales.find(
            item =>
                item.invoiceNumber ===
                invoiceNumber
        );


    if (!sale) {

        alert(
            "Invoice not found."
        );

        return;

    }


    const printWindow =
        window.open(
            "",
            "_blank",
            "width=800,height=900"
        );


    if (!printWindow) {

        alert(
            "Please allow pop-ups to print invoices."
        );

        return;

    }


    const itemsHTML =
        sale.items
            .map(
                item => `

                    <tr>

                        <td>
                            ${escapeHTML(
                                item.name
                            )}
                        </td>

                        <td>
                            ${item.quantity}
                        </td>

                        <td>
                            ${money(
                                item.price
                            )}
                        </td>

                        <td>
                            ${money(
                                item.lineTotal
                            )}
                        </td>

                    </tr>

                `
            )
            .join("");


    printWindow.document.write(`

        <!DOCTYPE html>

        <html>

        <head>

            <title>
                ${escapeHTML(
                    sale.invoiceNumber
                )}
            </title>


            <style>

                body {

                    font-family:
                        Arial,
                        sans-serif;

                    margin:
                        40px;

                    color:
                        #222;

                }


                .header {

                    display:
                        flex;

                    justify-content:
                        space-between;

                    border-bottom:
                        2px solid #222;

                    padding-bottom:
                        20px;

                    margin-bottom:
                        25px;

                }


                h1 {

                    margin:
                        0;

                }


                table {

                    width:
                        100%;

                    border-collapse:
                        collapse;

                    margin-top:
                        30px;

                }


                th,
                td {

                    padding:
                        12px;

                    border-bottom:
                        1px solid #ddd;

                    text-align:
                        left;

                }


                .totals {

                    width:
                        300px;

                    margin-left:
                        auto;

                    margin-top:
                        25px;

                }


                .total-row {

                    display:
                        flex;

                    justify-content:
                        space-between;

                    padding:
                        7px;

                }


                .grand {

                    font-size:
                        20px;

                    font-weight:
                        bold;

                    border-top:
                        2px solid #222;

                }


                .footer {

                    text-align:
                        center;

                    margin-top:
                        60px;

                }

            </style>

        </head>


        <body>


            <div class="header">

                <div>

                    <h1>
                        WOOD & CURTAIN
                    </h1>

                    <p>
                        POS SYSTEM
                    </p>

                </div>


                <div>

                    <strong>
                        INVOICE
                    </strong>

                    <br>

                    ${escapeHTML(
                        sale.invoiceNumber
                    )}

                    <br>

                    ${new Date(
                        sale.date
                    ).toLocaleString(
                        "en-LK"
                    )}

                </div>

            </div>


            <div>

                <strong>
                    Customer:
                </strong>

                ${escapeHTML(
                    sale.customerName ||
                    "Walk-in Customer"
                )}

            </div>


            <table>

                <thead>

                    <tr>

                        <th>
                            Product
                        </th>

                        <th>
                            Quantity
                        </th>

                        <th>
                            Price
                        </th>

                        <th>
                            Total
                        </th>

                    </tr>

                </thead>


                <tbody>

                    ${itemsHTML}

                </tbody>

            </table>


            <div class="totals">

                <div class="total-row">

                    <span>
                        Subtotal
                    </span>

                    <strong>
                        ${money(
                            sale.subtotal
                        )}
                    </strong>

                </div>


                <div class="total-row">

                    <span>
                        Discount
                    </span>

                    <strong>
                        ${money(
                            sale.discount
                        )}
                    </strong>

                </div>


                <div class="total-row grand">

                    <span>
                        TOTAL
                    </span>

                    <strong>
                        ${money(
                            sale.total
                        )}
                    </strong>

                </div>

            </div>


            <div>

                <strong>
                    Payment:
                </strong>

                ${escapeHTML(
                    sale.paymentMethod ||
                    "-"
                )}

            </div>


            <div class="footer">

                Thank you for your business!

            </div>


            <script>

                window.onload = function() {

                    window.print();

                };

            <\/script>


        </body>

        </html>

    `);


    printWindow.document.close();

}


// ============================================================
// PRINT FROM MODAL
// ============================================================

printInvoiceButton.addEventListener(
    "click",
    function() {

        const invoice =
            this.dataset.invoice;


        if (invoice) {

            printInvoice(
                invoice
            );

        }

    }
);


// ============================================================
// FILTER EVENTS
// ============================================================

search.addEventListener(
    "input",
    renderSales
);


paymentFilter.addEventListener(
    "change",
    renderSales
);


dateFilter.addEventListener(
    "change",
    renderSales
);


// ============================================================
// ESCAPE KEY
// ============================================================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape"
        ) {

            closeInvoice();

        }

    }
);


// ============================================================
// START
// ============================================================

renderSales();
