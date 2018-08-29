/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import Utils from '../../misc/utils';
import { Injectable, ReflectiveInjector, Injector, InjectionToken, Inject } from '@angular/core';
import { DocumentModel } from './documentModel';
import { FileService } from '../../providers/file/file.service';

export const FILE_NAME = new InjectionToken<string>('fileName');

@Injectable()
export class Document implements DocumentModel {

    protected _content: Uint8Array;

    /**
     * File name of document. It could be used to save or
     * give a name in attachment or download.
     * @type {string}
     * @memberof DocumentModel
     */
    fileName: string;

    /**
     * Full path to source file of this document.
     * @type {string}
     * @memberof DocumentModel
     */
    fullName?: string;

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


    static fromFile(injector: Injector, sourceFileName: string): DocumentModel {
        const documentInjector = ReflectiveInjector.resolveAndCreate(
            [
                Document,
                { provide: FILE_NAME, useValue: sourceFileName }
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
        @Inject(FILE_NAME) private sourceFileName: string
    ) {
        this.loadFromFile(this.sourceFileName);
    }

    /**
     * Loads document data from a file.
     * @static
     * @param {string} fileName The file to load.
     * @returns {Document} Created Document.
     * @memberof Document
     */
    private loadFromFile(sourceFileName: string) {
        const that = this;
        this.fileName = this._fileService.pathExtractFileName(sourceFileName);
        this.fullName = sourceFileName;
        this.mimeType = Utils.getMimeType(sourceFileName);

        if (!this.mimeType) {
            throw new Error(`No mime type found for the file '${sourceFileName}'. This file is not supported.`);
        }

        return this._fileService.readBytes(sourceFileName).subscribe(data => {
            that._content = data;
        });
    }

}
