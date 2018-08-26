/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { FileService } from '../../services/file/file.service';
import Utils from '../../misc/utils';
import { Injectable, ReflectiveInjector, Injector, InjectionToken, Inject } from '@angular/core';
import { DocumentModel } from './documentModel';

export const FILE_NAME = new InjectionToken<string>('fileName');

@Injectable()
export class Document implements DocumentModel {

    protected _content: Uint8Array;

    /**
     * Gets the mime type of template document.
     * @abstract
     * @type {string}
     * @memberof DocumentTemplate
     */
    mimeType: string;

    /**
     * Get the content of document as his binary representation.
     * @readonly
     * @type {Uint8Array}
     * @memberof Document
     */
    get content(): Uint8Array { return this._content; }


    static fromFile(injector: Injector, fileName: string): DocumentModel {
        const documentInjector = ReflectiveInjector.resolveAndCreate(
            [
                Document,
                { provide: FILE_NAME, useValue: fileName }
            ],
            injector);
        const document = documentInjector.resolveAndInstantiate([Document]);
        return document;
    }

    /**
     * Creates an instance of Document.
     * @param {string} mimeType The type of document.
     * @memberof Document
     */
    constructor(
        private _fileService: FileService,
        @Inject(FILE_NAME) private fileName: string
    ) {
        this.loadFromFile(this.fileName);
    }

    /**
     * Loads document data from a file.
     * @static
     * @param {string} fileName The file to load.
     * @returns {Document} Created Document.
     * @memberof Document
     */
    private loadFromFile(fileName: string) {
        const that = this;
        this.mimeType = Utils.getMimeType(fileName);

        if (!this.mimeType) {
            throw new Error(`No mime type found for the file '${fileName}'. This file is not supported.`);
        }

        return this._fileService.readBytes(fileName).subscribe(data => {
            that._content = data;
        });
    }

}
