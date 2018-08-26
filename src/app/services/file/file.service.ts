/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

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

    private _fs: any;

    /**
     *Creates an instance of FileService.
     * @memberof FileService
     */
    constructor() { }

    private get fs(): any {
        // if (!this._fs) {
        //     this._fs = (<any>window).require('fs');
        // }
        // return this._fs;
        return null;
    }

    /**
     * Reads a the specified fileName and returns his content as a byte array.
     * @param {string} fileName The file to read.
     * @returns {Observable<Uint8Array>} Byte array with file content.
     * @memberof FileService
     */
    readBytes(fileName: string): Observable<Uint8Array> {
        const subject = new ReplaySubject<Uint8Array>();
        this.fs.readFile(fileName, (err, data) => {
            subject.next(new Uint8Array(data));
        });
        return subject;
    }
}
