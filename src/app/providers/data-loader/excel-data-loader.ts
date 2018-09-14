/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Injectable } from '@angular/core';
import * as excelToJson from 'convert-excel-to-json';
import { from, Observable } from 'rxjs';
import { LogService } from '../log-service';
import { DataLoader } from './data-loader';
import { MergeableRowDataModel } from './mergeableRowDataModel';

@Injectable()
export class ExcelDataLoader extends DataLoader {

    constructor(private _logger: LogService) {
        super();
    }

    /**
     * Load data from an Excel file and return it as key/value simple structure.
     * @abstract
     * @param {string} fileName The file where are the data.
     * @returns {{ [fieldName: string]: object }} The built data.
     * @memberof DataLoader
     */
    load(fileName: string): Observable<MergeableRowDataModel[]> {
        this._logger.debug(`Starting to load data from Excel file '${fileName}'.`);
        return from(new Promise((resolve, reject) => {
            try {
                const result = excelToJson({
                    sourceFile: fileName,
                    columnToKey: {
                        '*': '{{columnHeader}}'
                    }
                });

                const sheetOneKey = Object.keys(result)[0];
                const sheetOneData = <MergeableRowDataModel[]>result[sheetOneKey];

                this._logger.info(`Data from Excel file '${fileName}' loaded successfully.`);
                resolve(sheetOneData.slice(1, sheetOneData.length));
            } catch (error) {
                this._logger.error(`Loading from Excel file '${fileName}' fail with error:\n${error}`);
                reject(error);
            }
        }));
    }

}
