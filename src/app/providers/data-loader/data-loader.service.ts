/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Injectable } from '@angular/core';
import { MergeableRowDataModel } from './mergeableRowDataModel';
import { DataLoader } from './data-loader';
import { Observable, empty } from 'rxjs';
import { FileService } from '../file/file.service';
import { ExcelDataLoader } from './excel-data-loader';
import Utils from '../../misc/utils';
import { MIMETYPE_XLSX } from '../../misc/const';
import { LogService } from '../log-service';

@Injectable({
    providedIn: 'root'
})
export class DataLoaderService {

    constructor(
        private _logger: LogService,
        private _fileService: FileService,
        private _excelLoader: ExcelDataLoader,
    ) { }

    /**
     * Get data from the specified file. The data builder depends to the
     * type of file.
     *
     * For xlsx file: Take first sheet, then take first line as field name.
     * @param {string} fileName The file where is the data.
     * @returns {*} An object with loaded data.
     * @memberof DataLoaderService
     */
    fromFile(fileName: string): Observable<MergeableRowDataModel[]> {
        this._logger.debug(`Starting to load mergeable data from file '${fileName}'.`);
        if (!this._fileService.fileExists(fileName)) {
            throw new Error(`File '${fileName}' doesn't exists.`);
        }
        const loader = this.getLoader(fileName);
        this._logger.debug(`Loader found as '${loader.constructor.name}'. Start loading...`);
        const result = loader.load(fileName);
        this._logger.info(`Data loader successfully from file '${fileName}'`);
        return result;
    }

    /**
     * Get loader that is able to read data from the specified fileName.
     * @protected
     * @param {string} fileName File to load.
     * @returns {DataLoader} The loader that correspond to type of fileName.
     * @memberof DataLoaderService
     */
    protected getLoader(fileName: string): DataLoader {
        switch (Utils.getMimeType(fileName)) {
            case MIMETYPE_XLSX:
                return this._excelLoader;
            default:
                throw new Error(`No loader found for file '${fileName}'.`);
        }
    }

}
