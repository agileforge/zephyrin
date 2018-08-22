/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export class Document {

    protected _content: Uint8Array;

    /**
     * Creates an instance of Document.
     * @param {string} mimeType The type of document.
     * @memberof Document
     */
    constructor(mimeType: string, content?: Uint8Array) {
        this.mimeType = mimeType;
        this._content = content || new Uint8Array(); // User atob to get byte array ?
    }

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

    /**
     * Loads and create a Document from a file.
     * @static
     * @param {string} fileName The file to load.
     * @returns {Document} Created Document.
     * @memberof Document
     */
    static fromFile(fileName: string): Document {
        // const fs = require('fs');
        // fs.readFile(fileName, (err, data) => {
        // });
        throw new Error();
    }
}
