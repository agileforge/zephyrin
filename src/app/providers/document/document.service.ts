/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Injectable } from '@angular/core';
import { DocumentModel } from './documentModel';
import Utils from '../../misc/utils';
import { Observable } from 'rxjs';
import { FileService } from '../file/file.service';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class DocumentService {

    constructor(
        private _fileService: FileService,
    ) { }

    /**
     * Loads document data from a file.
     * @static
     * @param {string} fileName The file to load.
     * @returns {Document} Created Document.
     * @memberof Document
     */
    loadFromFile(sourceFileName: string): Observable<DocumentModel> {
        const document = <DocumentModel>{};
        document.fileName = this._fileService.pathExtractFileName(sourceFileName);
        document.fullName = sourceFileName;
        document.mimeType = Utils.getMimeType(sourceFileName);

        if (!document.mimeType) {
            throw new Error(`No mime type found for the file '${sourceFileName}'. This file is not supported.`);
        }

        return this._fileService.readBytes(sourceFileName).pipe(
            map(data => {
                document.content = data;
                return document;
            })
        );
    }
}
