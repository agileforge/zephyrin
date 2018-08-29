import { MergeableRowDataModel } from './mergeableRowDataModel';
import { Observable } from 'rxjs';

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
