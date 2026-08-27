// ==========================================
// WOOD & CURTAIN POS
// CUSTOMER MANAGEMENT
// ==========================================

let customers = JSON.parse(
    localStorage.getItem("woodCurtainCustomers")
) || [];


// ==========================================
// ELEMENTS
// ==========================================

const tableBody =
    document.getElementById("customersTableBody");

const empty =
    document.getElementById("customersEmpty");

const search =
    document.getElementById("customerSearch");

const typeFilter =
    document.getElementById("customerTypeFilter");

const modal =
    document.getElementById("customerModal");

const form =
    document.getElementById("customerForm");


// ==========================================
// SAVE CUSTOMERS
// ==========================================

function saveCustomers() {

    localStorage.setItem(
        "woodCurtainCustomers",
        JSON.stringify(customers)
    );

}


// ==========================================
// CURRENCY
// ==========================================

function currency(value) {

    return "Rs. " +
        Number(value || 0).toLocaleString(
            "en-LK",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

}


// ==========================================
// RENDER CUSTOMERS
// ==========================================

function renderCustomers() {

    customers =
        JSON.parse(
            localStorage.getItem(
                "woodCurtainCustomers"
            )
        ) || [];


    const searchText =
        search.value
            .toLowerCase()
            .trim();


    const selectedType =
        typeFilter.value;


    const filtered =
        customers.filter(customer => {

            const name =
                String(customer.name || "")
                    .toLowerCase();

            const phone =
                String(customer.phone || "")
                    .toLowerCase();

            const email =
                String(customer.email || "")
                    .toLowerCase();


            const matchesSearch =
                name.includes(searchText) ||
                phone.includes(searchText) ||
                email.includes(searchText);


            const matchesType =
                selectedType === "all" ||
                customer.type === selectedType;


            return (
                matchesSearch &&
                matchesType
            );

        });


    tableBody.innerHTML = "";


    if (filtered.length === 0) {

        empty.style.display = "block";

    } else {

        empty.style.display = "none";

    }


    filtered.forEach(customer => {

        const row =
            document.createElement("tr");


        const firstLetter =
            customer.name
                .charAt(0)
                .toUpperCase();


        const balance =
            Number(
                customer.balance || 0
            );


        row.innerHTML = `

            <td>

                <div class="customer-name">

                    <div class="customer-avatar">

                        ${firstLetter}

                    </div>

                    <div>

                        <strong>
                            ${escapeHTML(
                                customer.name
                            )}
                        </strong>

                        <small>
                            ID: ${customer.id}
                        </small>

                    </div>

                </div>

            </td>


            <td>

                <span class="customer-phone">

                    ${escapeHTML(
                        customer.phone
                    )}

                </span>

            </td>


            <td>

                <span class="customer-email">

                    ${
                        customer.email
                            ? escapeHTML(
                                customer.email
                              )
                            : "-"
                    }

                </span>

            </td>


            <td>

                <span class="type-badge">

                    ${escapeHTML(
                        customer.type || "Retail"
                    )}

                </span>

            </td>


            <td>

                <span class="${
                    balance > 0
                        ? "balance-due"
                        : "balance-normal"
                }">

                    ${currency(balance)}

                </span>

            </td>


            <td>

                <div class="customer-actions">

                    <button
                        class="customer-action"
                        onclick="editCustomer('${customer.id}')">

                        Edit

                    </button>


                    <button
                        class="customer-action delete"
                        onclick="deleteCustomer('${customer.id}')">

                        Delete

                    </button>

                </div>

            </td>

        `;


        tableBody.appendChild(row);

    });


    updateStatistics();

}


// ==========================================
// HTML SECURITY
// ==========================================

function escapeHTML(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ==========================================
// STATISTICS
// ==========================================

function updateStatistics() {

    const total =
        customers.length;


    const active =
        customers.filter(
            customer =>
                customer.active !== false
        ).length;


    const purchasing =
        customers.filter(
            customer =>
                Number(
                    customer.purchaseCount || 0
                ) > 0
        ).length;


    const outstanding =
        customers.reduce(
            (
                total,
                customer
            ) =>
                total +
                Number(
                    customer.balance || 0
                ),
            0
        );


    document.getElementById(
        "totalCustomers"
    ).textContent = total;


    document.getElementById(
        "activeCustomers"
    ).textContent = active;


    document.getElementById(
        "purchasingCustomers"
    ).textContent = purchasing;


    document.getElementById(
        "outstandingBalance"
    ).textContent =
        currency(outstanding);

}


// ==========================================
// OPEN ADD CUSTOMER
// ==========================================

function openAddCustomer() {

    form.reset();


    document.getElementById(
        "customerId"
    ).value = "";


    document.getElementById(
        "customerModalTitle"
    ).textContent =
        "Add Customer";


    document.getElementById(
        "creditLimit"
    ).value = "0";


    modal.classList.add("show");

}


// ==========================================
// ADD CUSTOMER BUTTON
// ==========================================

document.getElementById(
    "addCustomerButton"
).addEventListener(
    "click",
    openAddCustomer
);


document.getElementById(
    "emptyAddCustomer"
).addEventListener(
    "click",
    openAddCustomer
);


// ==========================================
// CLOSE MODAL
// ==========================================

function closeCustomerModal() {

    modal.classList.remove("show");

}


document.getElementById(
    "closeCustomerModal"
).addEventListener(
    "click",
    closeCustomerModal
);


document.getElementById(
    "cancelCustomer"
).addEventListener(
    "click",
    closeCustomerModal
);


// ==========================================
// SAVE CUSTOMER
// ==========================================

form.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const id =
            document.getElementById(
                "customerId"
            ).value;


        const name =
            document.getElementById(
                "customerName"
            ).value.trim();


        const phone =
            document.getElementById(
                "customerPhone"
            ).value.trim();


        const email =
            document.getElementById(
                "customerEmail"
            ).value.trim();


        const type =
            document.getElementById(
                "customerType"
            ).value;


        const creditLimit =
            Number(
                document.getElementById(
                    "creditLimit"
                ).value || 0
            );


        if (!name || !phone) {

            alert(
                "Please enter customer name and phone number."
            );

            return;

        }


        // ======================================
        // EDIT EXISTING CUSTOMER
        // ======================================

        if (id) {

            const customer =
                customers.find(
                    item =>
                        String(item.id) ===
                        String(id)
                );


            if (customer) {

                customer.name =
                    name;

                customer.phone =
                    phone;

                customer.email =
                    email;

                customer.type =
                    type;

                customer.creditLimit =
                    creditLimit;

            }

        }


        // ======================================
        // CREATE NEW CUSTOMER
        // ======================================

        else {

            const customer = {

                id:
                    "CUS-" +
                    Date.now(),

                name:
                    name,

                phone:
                    phone,

                email:
                    email,

                type:
                    type,

                creditLimit:
                    creditLimit,

                balance:
                    0,

                purchaseCount:
                    0,

                active:
                    true,

                createdAt:
                    new Date().toISOString()

            };


            customers.push(
                customer
            );

        }


        saveCustomers();

        renderCustomers();

        closeCustomerModal();

    }
);


// ==========================================
// EDIT CUSTOMER
// ==========================================

function editCustomer(id) {

    const customer =
        customers.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!customer) {
        return;
    }


    document.getElementById(
        "customerId"
    ).value =
        customer.id;


    document.getElementById(
        "customerName"
    ).value =
        customer.name;


    document.getElementById(
        "customerPhone"
    ).value =
        customer.phone;


    document.getElementById(
        "customerEmail"
    ).value =
        customer.email || "";


    document.getElementById(
        "customerType"
    ).value =
        customer.type || "Retail";


    document.getElementById(
        "creditLimit"
    ).value =
        customer.creditLimit || 0;


    document.getElementById(
        "customerModalTitle"
    ).textContent =
        "Edit Customer";


    modal.classList.add("show");

}


// ==========================================
// DELETE CUSTOMER
// ==========================================

function deleteCustomer(id) {

    const customer =
        customers.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!customer) {
        return;
    }


    const confirmed =
        confirm(
            "Delete " +
            customer.name +
            "?"
        );


    if (!confirmed) {
        return;
    }


    customers =
        customers.filter(
            item =>
                String(item.id) !==
                String(id)
        );


    saveCustomers();

    renderCustomers();

}


// ==========================================
// SEARCH
// ==========================================

search.addEventListener(
    "input",
    renderCustomers
);


// ==========================================
// FILTER
// ==========================================

typeFilter.addEventListener(
    "change",
    renderCustomers
);


// ==========================================
// ESC KEY
// ==========================================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape"
        ) {

            closeCustomerModal();

        }

    }
);


// ==========================================
// START
// ==========================================

renderCustomers();
