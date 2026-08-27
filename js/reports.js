// ============================================================
// WOOD & CURTAIN POS
// REPORTS
// ============================================================

let sales = [];


// ============================================================
// ELEMENTS
// ============================================================

const fromDate =
    document.getElementById("fromDate");

const toDate =
    document.getElementById("toDate");

const applyReport =
    document.getElementById("applyReport");

const todayReport =
    document.getElementById("todayReport");

const printReport =
    document.getElementById("printReport");


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

    return "Rs. " +
        Number(value || 0).toLocaleString(
            "en-LK",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ============================================================
// DATE FORMAT
// ============================================================

function dateKey(date) {

    const d =
        new Date(date);

    return d.getFullYear() +
        "-" +
        String(
            d.getMonth() + 1
        ).padStart(2, "0") +
        "-" +
        String(
            d.getDate()
        ).padStart(2, "0");

}


// ============================================================
// SET TODAY
// ============================================================

function setToday() {

    const today =
        new Date();

    const key =
        dateKey(today);

    fromDate.value =
        key;

    toDate.value =
        key;

}


// ============================================================
// GET FILTERED SALES
// ============================================================

function getFilteredSales() {

    const from =
        fromDate.value;

    const to =
        toDate.value;


    return sales.filter(
        sale => {

            const saleKey =
                dateKey(sale.date);


            if (
                from &&
                saleKey < from
            ) {

                return false;

            }


            if (
                to &&
                saleKey > to
            ) {

                return false;

            }


            return true;

        }
    );

}


// ============================================================
// UPDATE MAIN STATS
// ============================================================

function updateStats(
    filteredSales
) {

    const total =
        filteredSales.reduce(
            (sum, sale) =>
                sum +
                Number(
                    sale.total || 0
                ),
            0
        );


    const orders =
        filteredSales.length;


    const average =
        orders > 0
            ? total / orders
            : 0;


    const items =
        filteredSales.reduce(
            (sum, sale) => {

                return sum +
                    (
                        sale.items
                            ? sale.items.reduce(
                                (
                                    itemSum,
                                    item
                                ) =>
                                    itemSum +
                                    Number(
                                        item.quantity ||
                                        0
                                    ),
                                0
                            )
                            : 0
                    );

            },
            0
        );


    document.getElementById(
        "reportTotalSales"
    ).textContent =
        money(total);


    document.getElementById(
        "reportOrders"
    ).textContent =
        orders;


    document.getElementById(
        "reportAverage"
    ).textContent =
        money(average);


    document.getElementById(
        "reportItems"
    ).textContent =
        items;

}


// ============================================================
// DAILY SALES
// ============================================================

function renderDailySales(
    filteredSales
) {

    const container =
        document.getElementById(
            "salesBars"
        );


    container.innerHTML = "";


    if (
        filteredSales.length === 0
    ) {

        container.innerHTML = `

            <div class="report-empty">

                No sales available
                for this period.

            </div>

        `;

        return;

    }


    const daily = {};


    filteredSales.forEach(
        sale => {

            const key =
                dateKey(
                    sale.date
                );


            if (!daily[key]) {

                daily[key] = 0;

            }


            daily[key] +=
                Number(
                    sale.total || 0
                );

        }
    );


    const days =
        Object.keys(
            daily
        ).sort();


    const max =
        Math.max(
            ...Object.values(
                daily
            )
        );


    days.forEach(
        day => {

            const amount =
                daily[day];


            const percentage =
                max > 0
                    ? (
                        amount /
                        max
                    ) * 100
                    : 0;


            const date =
                new Date(
                    day + "T00:00:00"
                );


            const label =
                date.toLocaleDateString(
                    "en-LK",
                    {
                        day:
                            "numeric",
                        month:
                            "short"
                    }
                );


            const bar =
                document.createElement(
                    "div"
                );


            bar.className =
                "sales-bar-row";


            bar.innerHTML = `

                <div class="sales-bar-label">

                    ${label}

                </div>


                <div class="sales-bar-track">

                    <div
                        class="sales-bar-fill"
                        style="width:${percentage}%"
                    >
                    </div>

                </div>


                <div class="sales-bar-value">

                    ${money(amount)}

                </div>

            `;


            container.appendChild(
                bar
            );

        }
    );

}


// ============================================================
// PAYMENT REPORT
// ============================================================

function renderPaymentReport(
    filteredSales
) {

    const container =
        document.getElementById(
            "paymentReport"
        );


    container.innerHTML = "";


    const payments = {};


    filteredSales.forEach(
        sale => {

            const method =
                sale.paymentMethod ||
                "Unknown";


            if (
                !payments[method]
            ) {

                payments[method] =
                    0;

            }


            payments[method] +=
                Number(
                    sale.total || 0
                );

        }
    );


    const entries =
        Object.entries(
            payments
        );


    if (
        entries.length === 0
    ) {

        container.innerHTML = `

            <div class="report-empty">
                No payment data.
            </div>

        `;

        return;

    }


    const total =
        entries.reduce(
            (
                sum,
                item
            ) =>
                sum +
                item[1],
            0
        );


    entries
        .sort(
            (
                a,
                b
            ) =>
                b[1] -
                a[1]
        )
        .forEach(
            entry => {

                const method =
                    entry[0];

                const amount =
                    entry[1];


                const percentage =
                    total > 0
                        ? (
                            amount /
                            total
                        ) * 100
                        : 0;


                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "payment-row";


                row.innerHTML = `

                    <div class="payment-row-top">

                        <strong>
                            ${escapeHTML(
                                method
                            )}
                        </strong>

                        <span>
                            ${money(amount)}
                        </span>

                    </div>


                    <div class="payment-track">

                        <div
                            class="payment-fill"
                            style="width:${percentage}%"
                        >
                        </div>

                    </div>


                    <small>
                        ${percentage.toFixed(1)}%
                    </small>

                `;


                container.appendChild(
                    row
                );

            }
        );

}


// ============================================================
// CATEGORY REPORT
// ============================================================

function renderCategoryReport(
    filteredSales
) {

    const container =
        document.getElementById(
            "categoryReport"
        );


    container.innerHTML = "";


    const categories = {};


    filteredSales.forEach(
        sale => {

            if (
                !sale.items
            ) {

                return;

            }


            sale.items.forEach(
                item => {

                    const category =
                        item.category ||
                        "Other";


                    if (
                        !categories[
                            category
                        ]
                    ) {

                        categories[
                            category
                        ] = 0;

                    }


                    categories[
                        category
                    ] +=
                        Number(
                            item.lineTotal ||
                            (
                                Number(
                                    item.price ||
                                    0
                                ) *
                                Number(
                                    item.quantity ||
                                    0
                                )
                            )
                        );

                }
            );

        }
    );


    const entries =
        Object.entries(
            categories
        );


    if (
        entries.length === 0
    ) {

        container.innerHTML = `

            <div class="report-empty">
                No category data.
            </div>

        `;

        return;

    }


    const total =
        entries.reduce(
            (
                sum,
                item
            ) =>
                sum +
                item[1],
            0
        );


    entries
        .sort(
            (
                a,
                b
            ) =>
                b[1] -
                a[1]
        )
        .forEach(
            entry => {

                const category =
                    entry[0];

                const amount =
                    entry[1];


                const percentage =
                    total > 0
                        ? (
                            amount /
                            total
                        ) * 100
                        : 0;


                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "category-row";


                row.innerHTML = `

                    <div>

                        <strong>
                            ${escapeHTML(
                                category
                            )}
                        </strong>

                        <span>
                            ${money(amount)}
                        </span>

                    </div>


                    <div class="category-track">

                        <div
                            class="category-fill"
                            style="width:${percentage}%"
                        >
                        </div>

                    </div>

                `;


                container.appendChild(
                    row
                );

            }
        );

}


// ============================================================
// BEST PRODUCTS
// ============================================================

function renderBestProducts(
    filteredSales
) {

    const container =
        document.getElementById(
            "bestProducts"
        );


    container.innerHTML = "";


    const products = {};


    filteredSales.forEach(
        sale => {

            if (
                !sale.items
            ) {

                return;

            }


            sale.items.forEach(
                item => {

                    const name =
                        item.name ||
                        "Unknown Product";


                    if (
                        !products[name]
                    ) {

                        products[name] = {

                            quantity: 0,

                            sales: 0

                        };

                    }


                    products[name]
                        .quantity +=
                        Number(
                            item.quantity ||
                            0
                        );


                    products[name]
                        .sales +=
                        Number(
                            item.lineTotal ||
                            0
                        );

                }
            );

        }
    );


    const entries =
        Object.entries(
            products
        );


    if (
        entries.length === 0
    ) {

        container.innerHTML = `

            <div class="report-empty">
                No product sales yet.
            </div>

        `;

        return;

    }


    entries
        .sort(
            (
                a,
                b
            ) =>
                b[1].sales -
                a[1].sales
        )
        .slice(
            0,
            10
        )
        .forEach(
            (
                entry,
                index
            ) => {

                const name =
                    entry[0];

                const data =
                    entry[1];


                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "best-product-row";


                row.innerHTML = `

                    <div class="product-rank">

                        ${index + 1}

                    </div>


                    <div class="best-product-name">

                        <strong>

                            ${escapeHTML(
                                name
                            )}

                        </strong>

                        <small>

                            ${data.quantity}
                            item(s) sold

                        </small>

                    </div>


                    <strong>

                        ${money(
                            data.sales
                        )}

                    </strong>

                `;


                container.appendChild(
                    row
                );

            }
        );

}


// ============================================================
// GENERATE REPORT
// ============================================================

function generateReport() {

    loadSales();


    const filtered =
        getFilteredSales();


    updateStats(
        filtered
    );


    renderDailySales(
        filtered
    );


    renderPaymentReport(
        filtered
    );


    renderCategoryReport(
        filtered
    );


    renderBestProducts(
        filtered
    );

}


// ============================================================
// EVENTS
// ============================================================

applyReport.addEventListener(
    "click",
    generateReport
);


todayReport.addEventListener(
    "click",
    function() {

        setToday();

        generateReport();

    }
);


// ============================================================
// PRINT REPORT
// ============================================================

printReport.addEventListener(
    "click",
    function() {

        window.print();

    }
);


// ============================================================
// START
// ============================================================

setToday();

generateReport();
