/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ElectronService } from '../electron.service';
import { LogService } from '../log-service';

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
    ) {
    }

    /**
     * Gets the current directory.
     * @readonly
     * @type {string}
     * @memberof FileService
     */
    get currentDir(): string { return this._electron.currentDir; }

    /**
     * Gets the temp directory of OS.
     * @readonly
     * @type {string}
     * @memberof FileService
     */
    get tempDir(): string {
        const path = this.pathJoin(this._electron.tempDir, 'zephyrin');
        this.makeDir(path);
        return path;
    }

    /**
     * Reads a the specified fileName and returns his content as a byte array.
     * @param {string} fileName The file to read.
     * @returns {Observable<Uint8Array>} Byte array with file content.
     * @memberof FileService
     */
    readBytes(fileName: string): Observable<Uint8Array> {
        const that = this;
        this._logger.debug(`Starting to read bytes from file '${fileName}'.`);
        return Observable.create(observer => {
            this._electron.fs.readFile(fileName, (err, data) => {
                if (err) {
                    that._logger.error(`Error reading file '${fileName}': '${err.message}'`);
                    observer.error(err);
                    return;
                }
                that._logger.debug(`File '${fileName}' read successfully.`);
                observer.next(new Uint8Array(data));
                observer.complete();
            });
        });
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
        return Observable.create(observer => {
            this._electron.fs.writeFile(fileName, new Buffer(content), err => {
                if (err) {
                    that._logger.error(`Error while writing to file '${fileName}': '${err.message}'`);
                    observer.error(err);
                    return;
                }
                that._logger.debug(`File '${fileName}' written successfully.`);
                observer.next();
                observer.complete();
            });
        });
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
        return Observable.create(observer => {
            this._electron.fs.writeFile(fileName, text, error => {
                if (error) {
                    that._logger.error(`Error while writing to file '${fileName}': '${error.message}'`);
                    observer.error(error);
                    return;
                }
                that._logger.debug(`File '${fileName}' written successfully.`);
                observer.next();
                observer.complete();
            });
        });
    }

    /**
     * Append text to the specified fileName. If file doesn't exists,
     * create it.
     * @param {string} fileName
     * @param {string} text
     * @returns {Observable<void>}
     * @memberof FileService
     */
    appendText(fileName: string, text: string): Observable<void> {
        const that = this;
        this._logger.debug(`Starting to append a text content to file '${fileName}'.`);
        return Observable.create(observer => {
            this._electron.fs.appendFile(fileName, text, error => {
                if (error) {
                    that._logger.error(`Error while writing to file '${fileName}': '${error.message}'`);
                    observer.error(error);
                    return;
                }
                that._logger.debug(`File '${fileName}' written successfully.`);
                observer.next();
                observer.complete();
            });
        });
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
        return Observable.create(observer => {
            this._electron.fs.readFile(fileName, 'utf8', (err, data) => {
                if (err) {
                    that._logger.error(`Error while reading file '${fileName}': '${err.message}'`);
                    observer.error(err);
                }
                that._logger.debug(`File '${fileName}' read successfully.`);
                observer.next(data);
                observer.complete();
            });
        });
    }

    /**
     * Gets directories under the specified path.
     * @param {string} path The parent path.
     * @returns {Observable<string[]>} An array of strings that contains the sub directories.
     * @memberof FileService
     */
    getDirectories(path: string): Observable<string[]> {
        const that = this;
        this._logger.debug(`Starting to get sub directories of path '${path}'.`);
        return Observable.create(observer => {
            this._electron.fs.readdir(path, (err, dirs) => {
                if (err) {
                    that._logger.error(`Error while getting sub directories of path '${path}': '${err.message}'`);
                    observer.error(err);
                }
                that._logger.debug(`Sub directories of path '${path}' found successfully as:${dirs}`);
                observer.next(dirs);
                observer.complete();
            });
        });
    }

    /**
     * Creates the specified directoryPath.
     * @param {string} directoryPath Directory to create.
     * @memberof FileService
     */
    makeDir(directoryPath: string): void {
        if (this._electron.fs.existsSync(directoryPath)) {
            return;
        }

        const pathDirs = directoryPath.split(this._electron.path.sep);
        const parentDir = pathDirs.slice(0, pathDirs.length - 1).join(this._electron.path.sep);

        if (!this._electron.fs.existsSync(parentDir)) {
            this.makeDir(parentDir);
        }
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
        const that = this;
        this._logger.debug(`Starting to copy file '${source}' to '${dest}'...`);
        return Observable.create(observer => {
            this._electron.fs.copyFile(source, dest, error => {
                if (error) {
                    that._logger.debug(`Fail to copy file '${source}' to '${dest}'...`, error);
                    observer.error(error);
                } else {
                    this._logger.debug(`File '${source}' has been successfully copied to '${dest}'...`);
                    observer.next();
                    observer.complete();
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
        const that = this;
        this._logger.debug(`Starting to move file '${source}' to '${dest}'...`);
        return Observable.create(observer => {
            this._electron.fs.rename(source, dest, error => {
                if (error) {
                    that._logger.debug(`Fail to move file '${source}' to '${dest}'...`, error);
                    observer.error(error);
                } else {
                    this._logger.debug(`File '${source}' has been successfully moved to '${dest}'...`);
                    observer.next();
                    observer.complete();
                }
            });
        });
    }

    /**
     * Deletes the specified fileName.
     * @param {string} fileName File to delete.
     * @returns {Observable<void>}
     * @memberof FileService
     */
    deleteFile(fileName: string): Observable<void> {
        const that = this;
        this._logger.debug(`Starting to delete file '${fileName}'...`);
        return Observable.create(observer => {
            this._electron.fs.unlink(fileName, error => {
                if (error) {
                    that._logger.debug(`Fail to delete file '${fileName}'.`, error);
                    observer.error(error);
                } else {
                    this._logger.debug(`File '${fileName}' has been successfully deleted.`);
                    observer.next();
                    observer.complete();
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
        return this._electron.path.join(...paths);
    }

    /**
     * Return the last portion of a path. Similar to the Unix basename command.
     * Often used to extract the file name from a fully qualified path.
     * @param {string} fileName The file where the file name is.
     * @returns {string} Only the base file name.
     * @memberof FileService
     */
    pathExtractFileName(fileName: string): string {
        return this._electron.path.basename(fileName);
    }

    /**
     * Change the extension of the specified file.
     * @param {string} fileName File to change.
     * @param {string} extension New extension including dot. Ex: '.ext'
     * @memberof FileService
     */
    changeExtension(fileName: string, extension: string): string {
        const pos = fileName.lastIndexOf('.');
        return fileName.substr(0, pos < 0 ? fileName.length : pos) + extension;
    }
}
