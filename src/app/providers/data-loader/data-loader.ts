/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Observable } from 'rxjs';
import { MergeableRowDataModel } from './mergeableRowDataModel';

/**
 * Base class for data loaders.
 * @export
 * @abstract
 * @class DataLoader
 */
export abstract class DataLoader {

    /**
     * Load data from a file and return it as key/value simple structure.
     * @abstract
     * @param {string} fileName The file where are the data.
     * @returns {{ [fieldName: string]: object }} The built data.
     * @memberof DataLoader
     */
    abstract load(fileName: string): Observable<MergeableRowDataModel[]>;

}
