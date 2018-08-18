/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.  *  
 * Licensed under the MIT License. See License.txt in the project root for license information.  
 *--------------------------------------------------------------------------------------------*/
import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as url from 'url';

let win;

function createWindow() {
    win = new BrowserWindow({ 
        width: 800, 
        height: 600 
    });

    win.setMenu(null);

    // load the dist folder from Angular
    win.loadURL(
        url.format({ 
            pathname: path.join(__dirname, `/dist/index.html`), 
            protocol: "file:", slashes: true 
        })
    );  
    
    win.on("closed", () => {     
        win = null;   
    }); 
}  

app.on("ready", createWindow);  

// On macOS, closing the window doesn't quit the app 
app.on("window-all-closed", () => {   
    if (process.platform !== "darwin") {     
        app.quit();   
    } 
});  

// Initialize the app's main window 
app.on("activate", () => {   
    if (win === null) {     
        createWindow();   
    } 
});
