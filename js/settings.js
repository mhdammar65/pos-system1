// ============================================================
// WOOD & CURTAIN POS
// SETTINGS
// ============================================================


const DEFAULT_SETTINGS = {

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


// ============================================================
// ELEMENTS
// ============================================================

const businessName =
    document.getElementById(
        "businessName"
    );

const businessPhone =
    document.getElementById(
        "businessPhone"
    );

const currency =
    document.getElementById(
        "currency"
    );

const invoicePrefix =
    document.getElementById(
        "invoicePrefix"
    );

const minimumStock =
    document.getElementById(
        "minimumStock"
    );

const saveButton =
    document.getElementById(
        "saveSettings"
    );

const resetButton =
    document.getElementById(
        "resetSettings"
    );

const message =
    document.getElementById(
        "settingsMessage"
    );


// ============================================================
// LOAD SETTINGS
// ============================================================

function loadSettings() {

    const saved =
        JSON.parse(
            localStorage.getItem(
                "woodCurtainSettings"
            )
        ) || {};


    const settings = {

        ...DEFAULT_SETTINGS,

        ...saved

    };


    businessName.value =
        settings.businessName;

    businessPhone.value =
        settings.businessPhone;

    currency.value =
        settings.currency;

    invoicePrefix.value =
        settings.invoicePrefix;

    minimumStock.value =
        settings.minimumStock;

}


// ============================================================
// SAVE SETTINGS
// ============================================================

function saveSettings() {

    const settings = {

        businessName:
            businessName.value.trim() ||
            DEFAULT_SETTINGS.businessName,

        businessPhone:
            businessPhone.value.trim(),

        currency:
            currency.value,

        invoicePrefix:
            invoicePrefix.value
                .trim()
                .toUpperCase() ||
            DEFAULT_SETTINGS.invoicePrefix,

        minimumStock:
            Math.max(
                0,
                Number(
                    minimumStock.value
                ) || 0
            )

    };


    localStorage.setItem(

        "woodCurtainSettings",

        JSON.stringify(
            settings
        )

    );


    showMessage(
        "Settings saved successfully.",
        "success"
    );

}


// ============================================================
// RESET
// ============================================================

function resetSettings() {

    const confirmed =
        confirm(
            "Reset all POS settings to default?"
        );


    if (!confirmed) {

        return;

    }


    localStorage.setItem(

        "woodCurtainSettings",

        JSON.stringify(
            DEFAULT_SETTINGS
        )

    );


    loadSettings();


    showMessage(
        "Settings reset successfully.",
        "success"
    );

}


// ============================================================
// MESSAGE
// ============================================================

function showMessage(
    text,
    type
) {

    message.textContent =
        text;

    message.className =
        "settings-message " +
        type;


    setTimeout(
        function() {

            message.textContent =
                "";

            message.className =
                "settings-message";

        },
        3000
    );

}


// ============================================================
// EVENTS
// ============================================================

saveButton.addEventListener(
    "click",
    saveSettings
);


resetButton.addEventListener(
    "click",
    resetSettings
);


// ============================================================
// START
// ============================================================

loadSettings();
