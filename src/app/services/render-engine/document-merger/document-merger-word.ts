/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Injectable } from '@angular/core';
import { DocumentModel } from '../../../complexes/documents/documentModel';
import { DocumentMerger } from './document-merger';

/**
 * Service that is able to merge data with a text document template.
 * @export
 * @class DocumentMergerService
 */
@Injectable({
    providedIn: 'root'
})
export class DocumentMergerWord extends DocumentMerger {

    constructor() {
        super();
    }

    /**
     * Merge some data to a text document by replacing placeholders represented as '{field_name}'.
     * @abstract
     * @param {*} data Object that contains the source data for replacement.
     * @param {DocumentModel} template Template document where are the placeholders.
     * @returns {DocumentModel} Merged text document.
     * @memberof DocumentMerger
     */
    merge(data: any, template: DocumentModel): DocumentModel {
        throw Error('Not implemented');
    }

}
