import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame, remote, dialog } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import BrowserWindow = Electron.BrowserWindow;

@Injectable()
export class ElectronService {

    ipcRenderer: typeof ipcRenderer;
    webFrame: typeof webFrame;
    remote: typeof remote;
    childProcess: typeof childProcess;
    fs: typeof fs;
    dialog: typeof dialog;
    window: BrowserWindow;

    constructor() {
        // Conditional imports
        if (this.isElectron()) {
            this.ipcRenderer = window.require('electron').ipcRenderer;
            this.webFrame = window.require('electron').webFrame;
            this.remote = window.require('electron').remote;
            this.window = this.remote.getCurrentWindow();

            this.childProcess = window.require('child_process');
            this.fs = window.require('fs');
            // this.dialog = window.require('dialog');
        }
    }

    isElectron = () => {
        return window && window.process && window.process.type;
    }

}
