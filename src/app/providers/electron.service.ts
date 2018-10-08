/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Injectable } from '@angular/core';
import * as childProcess from 'child_process';
// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { BrowserWindow, dialog, ipcRenderer, remote, Shell, webFrame } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import { AppConfig } from '../../environments/environment';

@Injectable()
export class ElectronService {

    ipcRenderer: typeof ipcRenderer;
    webFrame: typeof webFrame;
    remote: typeof remote;
    childProcess: typeof childProcess;
    fs: typeof fs;
    path: typeof path;
    dialog: typeof dialog;
    window: BrowserWindow;
    shell: Shell;

    constructor() {
        // Conditional imports
        if (this.isElectron()) {
            this.ipcRenderer = window.require('electron').ipcRenderer;
            this.webFrame = window.require('electron').webFrame;
            this.remote = window.require('electron').remote;
            this.window = this.remote.getCurrentWindow();
            this.shell = window.require('electron').shell;

            this.childProcess = window.require('child_process');
            this.fs = window.require('fs');
            this.path = window.require('path');
            // this.dialog = window.require('dialog');
        }
    }

    isElectron = () => {
        return window && window.process && window.process.type;
    }

    /**
     * Gets the current directory.
     * @readonly
     * @type {string}
     * @memberof ElectronService
     */
    get currentDir(): string {
        if (AppConfig.environment === 'LOCAL') {
            return process.env.HOME;
        } else {
            return process.env.PORTABLE_EXECUTABLE_DIR;
        }
    }

    /**
     * Return the temp directory of os.
     *
     * @readonly
     * @type {string}
     * @memberof ElectronService
     */
    get tempDir(): string { return this.remote.app.getPath('temp'); }

    /**
     * Create new BrowserWindow.
     * @param {Electron.BrowserWindowConstructorOptions} [options]
     * @returns {BrowserWindow}
     * @memberof ElectronService
     */
    createBrowserWindow(options?: Electron.BrowserWindowConstructorOptions): BrowserWindow {
        const bw = this.remote.BrowserWindow;
        return new bw(options);
    }
}
