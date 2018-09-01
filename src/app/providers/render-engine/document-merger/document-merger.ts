/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Injectable } from '@angular/core';
import { MergeableRowDataModel } from '../../data-loader/mergeableRowDataModel';
import { DocumentModel } from '../../document/documentModel';
// import { RenderedDocument } from '../../../complexes/documents/rendered-document';

/**
 * Service that is able to merge data with a document template.
 * @export
 * @class DocumentMergerService
 */
@Injectable({
    providedIn: 'root'
})
export abstract class DocumentMerger {

    constructor() { }

    /**
     * Merge some data to a document by replacing placeholders represented as '{field_name}'.
     * @abstract
     * @param {*} data Object that contains the source data for replacement.
     * @param {DocumentModel} template Template document where are the placeholders.
     * @returns {DocumentModel} Merged document.
     * @memberof DocumentMerger
     */
    abstract merge(data: MergeableRowDataModel, template: DocumentModel): DocumentModel;

}
