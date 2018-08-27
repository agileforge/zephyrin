/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Injectable } from '@angular/core';
import { DocumentModel } from '../../../complexes/documents/documentModel';
import Utils from '../../../misc/utils';

/**
 * Service that is able to merge data with a text document template.
 * @export
 * @class DocumentMergerService
 */
@Injectable({
    providedIn: 'root'
})
export abstract class DocumentMergerTxt {

    private _encoder: TextEncoder;
    private _decoder: TextDecoder;
    private _placeholderRegex = /\{([\w\d-\_]*)\}/g;

    constructor() {
        this._encoder = new TextEncoder();
        this._decoder = new TextDecoder();
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
        // Gets clear text
        const text = this._decoder.decode(template.content);
        // Find and replace placeholders with data
        const result = text.replace(this._placeholderRegex, placeholder => {
            const fieldName = placeholder.replace('{', '').replace('}', '');
            return Utils.getPropertyCI(data, fieldName) || placeholder;
        });
        // Encode result in a new document
        return <DocumentModel>{
            mimeType: template.mimeType,
            content: this._encoder.encode(result)
        };
    }

}
