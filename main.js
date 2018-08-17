"use strict";
exports.__esModule = true;
/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.  *
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var electron_1 = require("electron");
var path = require("path");
var url = require("url");
var win;
function createWindow() {
    win = new electron_1.BrowserWindow({
        width: 800,
        height: 600
    });
    win.setMenu(null);
    // load the dist folder from Angular
    win.loadURL(url.format({
        pathname: path.join(__dirname, "/dist/index.html"),
        protocol: "file:", slashes: true
    }));
    win.on("closed", function () {
        win = null;
    });
}
electron_1.app.on("ready", createWindow);
// On macOS, closing the window doesn't quit the app 
electron_1.app.on("window-all-closed", function () {
    if (process.platform !== "darwin") {
        electron_1.app.quit();
    }
});
// Initialize the app's main window 
electron_1.app.on("activate", function () {
    if (win === null) {
        createWindow();
    }
});
//# sourceMappingURL=main.js.map