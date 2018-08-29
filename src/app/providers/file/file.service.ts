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
    writeBytes(fileName: string, content: Uint8Array): Observable<void> {
        const that = this;
        this._logger.debug(`Starting to write a binary content to file '${fileName}'.`);
        const subject = new ReplaySubject<void>();
        this._electron.fs.writeFile(fileName, content.buffer, err => {
            if (err) {
                that._logger.error(`Error while writing to file '${fileName}': '${err.message}'`);
                throw err;
            }
            that._logger.debug(`File '${fileName}' written successfully.`);
            subject.next();
        });
        return subject;
    }

    /**
     * Writes a text in a file. If file exists, replace it.
     * @param {string} text Text to write.
     * @param {string} fileName The file name to create.
     * @returns {Observable<void>}
     * @memberof FileService
     */
    writeText(fileName: string, text: string): Observable<void> {
        const that = this;
        this._logger.debug(`Starting to write a text content to file '${fileName}'.`);
        const subject = new ReplaySubject<void>();
        this._electron.fs.writeFile(fileName, text, err => {
            if (err) {
                that._logger.error(`Error while writing to file '${fileName}': '${err.message}'`);
                throw err;
            }
            that._logger.debug(`File '${fileName}' written successfully.`);
            subject.next();
        });
        return subject;
    }

    /**
     * Read text from a file.
     * @param {string} fileName The file name to read.
     * @returns {Observable<string>} Text contained in file.
     * @memberof FileService
     */
    readText(fileName: string): Observable<string> {
        const that = this;
        this._logger.debug(`Starting to read a text content from file '${fileName}'.`);
        const subject = new ReplaySubject<string>();
        this._electron.fs.readFile(fileName, 'utf8', (err, data) => {
            if (err) {
                that._logger.error(`Error while reading file '${fileName}': '${err.message}'`);
                throw err;
            }
            that._logger.debug(`File '${fileName}' read successfully.`);
            subject.next(data);
        });
        return subject;
    }

    /**
     * Creates the specified directoryPath.
     * @param {string} directoryPath Directory to create.
     * @memberof FileService
     */
    makeDir(directoryPath: string): void {
        this._electron.fs.mkdirSync(directoryPath);
    }

    /**
     * Copy specified source file to dest file.
     * @param {string} source Source file to copy.
     * @param {string} dest Destination file.
     * @returns {Observable<void>}
     * @memberof FileService
     */
    copyFile(source: string, dest: string): Observable<void> {
        return Observable.create(observer => {
            this._electron.fs.copyFile(source, dest, error => {
                if (error) {
                    observer.onError(error);
                } else {
                    observer.onNext();
                }
            });
        });
    }

    /**
     * Move specified source file to dest file.
     * @param {string} source Source file to copy.
     * @param {string} dest Destination file.
     * @returns {Observable<void>}
     * @memberof FileService
     */
    moveFile(source: string, dest: string): Observable<void> {
        return Observable.create(observer => {
            this._electron.fs.rename(source, dest, error => {
                if (error) {
                    observer.onError(error);
                } else {
                    observer.onNext();
                }
            });
        });
    }

    /**
     * Check if a file exists on disk.
     * @param {string} fileName The file to check.
     * @returns {boolean} True if exists; otherwise False.
     * @memberof FileService
     */
    fileExists(fileName: string): boolean {
        return this._electron.fs.existsSync(fileName);
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

    /**
     * Return the last portion of a path. Similar to the Unix basename command.
     * Often used to extract the file name from a fully qualified path.
     * @param {string} fileName The file where the file name is.
     * @returns {string} Only the base file name.
     * @memberof FileService
     */
    pathExtractFileName(fileName: string): string {
        return path.basename(fileName);
    }

}
