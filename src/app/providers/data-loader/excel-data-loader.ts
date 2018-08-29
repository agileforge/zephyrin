import { Injectable } from '@angular/core';
import { DataLoader } from './data-loader';
import { FileService } from '../file/file.service';
import { MergeableRowDataModel } from './mergeableRowDataModel';
import { Observable } from 'rxjs';
import * as excelToJson from 'convert-excel-to-json';
import { LogService } from '../log-service';

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
        return Observable.create(new Promise((resolve, reject) => {
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
                resolve(sheetOneData);
            } catch (error) {
                this._logger.error(`Loading from Excel file '${fileName}' fail with error:\n${error}`);
                reject(error);
            }
        }));
    }

}
