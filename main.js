const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
    const win = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1100,
        minHeight: 700,

        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    // Open login page first
    win.loadFile(
        path.join(__dirname, "login.html")
    );

    // Open DevTools if the page is blank
    // Uncomment this line if you need to debug
    // win.webContents.openDevTools();
}

app.whenReady().then(() => {

    createWindow();

    app.on("activate", () => {

        if (
            BrowserWindow.getAllWindows().length === 0
        ) {
            createWindow();
        }

    });

});

app.on("window-all-closed", () => {

    if (process.platform !== "darwin") {
        app.quit();
    }

});
