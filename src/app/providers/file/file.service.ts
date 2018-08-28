/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { ElectronService } from '../electron.service';
import { LogService } from '../log-service';
import * as path from 'path';

/**
 * File service to access to local files.
 * This is a facilitator class and allow to make file system mocked tests.
 * @export
 * @class FileService
 */
@Injectable({
    providedIn: 'root'
})
export class FileService {

    /**
     *Creates an instance of FileService.
     * @memberof FileService
     */
    constructor(
        private _logger: LogService,
        private _electron: ElectronService
    ) { }

    /**
     * Reads a the specified fileName and returns his content as a byte array.
     * @param {string} fileName The file to read.
     * @returns {Observable<Uint8Array>} Byte array with file content.
     * @memberof FileService
     */
    readBytes(fileName: string): Observable<Uint8Array> {
        const subject = new ReplaySubject<Uint8Array>();
        this._electron.fs.readFile(fileName, (err, data) => {
            subject.next(new Uint8Array(data));
        });
        return subject;
    }

    /**
     * Writes a the specified byte array to the specified file name.
     * @param {string} content The file content as byte array.
     * @param {string} fileName The target file name.
     * @memberof FileService
     */
    writeBytes(content: Uint8Array, fileName: string): Observable<{}> {
        const that = this;
        this._logger.debug(`Starting to write a binary content to file '${fileName}'.`);
        const subject = new ReplaySubject<{}>();
        this._electron.fs.writeFile(fileName, content.buffer, err => {
            if (err) {
                that._logger.error(`Error while writing to file '${fileName}': '${err.message}'`);
                throw err;
            }
            that._logger.debug(`File '${fileName}' written successfully.`);
            subject.next({});
        });
        return subject;
    }

    /**
     * Join all arguments together and normalize the resulting path.
     * Arguments must be strings. In v0.8, non-string arguments were
     * silently ignored. In v0.10 and up, an exception is thrown.
     * @param {...string[]} paths Path arguments.
     * @returns {string} Joined path.
     * @memberof FileService
     */
    pathJoin(...paths: string[]): string {
        return path.join(...paths);
    }

}
