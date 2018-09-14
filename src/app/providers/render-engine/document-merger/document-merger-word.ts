/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Injectable } from '@angular/core';
import * as DocxTemplater from 'docxtemplater';
import * as JSZip from 'jszip';
import { MIMETYPE_DOCX } from '../../../misc/const';
import { MergeableRowDataModel } from '../../data-loader/mergeableRowDataModel';
import { DocumentModel } from '../../document/documentModel';
import { FileService } from '../../file/file.service';
import { LogService } from '../../log-service';
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

    constructor(
        private _logger: LogService,
        private _fileService: FileService
    ) {
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
    merge(data: MergeableRowDataModel, template: DocumentModel): DocumentModel {
        // var path = require('path');

        // Load the docx file as a binary
        const zip = new JSZip(template.content);
        const doc = new DocxTemplater();
        doc.loadZip(zip);

        // Set the template data
        doc.setData(data);

        try {
            // Render the document by replacing all occurrences of placeholders {field_name}
            doc.render();
        } catch (err) {
            const error = {
                message: err.message,
                name: err.name,
                stack: err.stack,
                properties: err.properties,
            };
            this._logger.error(JSON.stringify({ error }));
            throw err;
        }

        const buf = doc.getZip().generate({ type: 'nodebuffer' });
        const mergedDocument = <DocumentModel>{
            mimeType: MIMETYPE_DOCX,
            content: new Uint8Array(buf)
        };
        this._logger.trace(mergedDocument);
        // this._fileService
        //     .writeBytes('/home/paf/Temp/merged.' + new Date().getTime().toString() + '.docx', mergedDocument.content)
        //     .subscribe();
        return mergedDocument;
    }

}
