/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export interface DocumentModel {

    /**
     * File name of document. It could be used to save or
     * give a name in attachment or download.
     * @type {string}
     * @memberof DocumentModel
     */
    fileName?: string;
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
    content: Uint8Array;

}
