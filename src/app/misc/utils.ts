import { FILE_COMPLIANT_REGEX, MIMETYPE_DOCX, MIMETYPE_PDF, MIMETYPE_TXT, MIMETYPE_XLSX } from './const';

/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Provides useful miscellaneous functions.
*/
export default class Utils {

    /**
     * Builds email address as "Full Name <my.email@somedomain.com>" respecting RFC specifications.
     * @param {string} address The email address.
     * @param {string} lastOrFullName Last nome or directly the full name.
     * @param {string} firstName The first name.
     * @returns {string} The full email address with the full name if possible.
     */
    static getEmailAddress(address: string, lastOrFullName?: string, firstName?: string): string {
        const fullName = `${(firstName || '').trim()} ${(lastOrFullName || '').trim()}`.trim();
        address = address.trim();
        if (fullName === '') {
            return address;
        }
        return `${fullName} <${address}>`;
    }

    /**
     * Determine witch mime type is related to fileName. If not type found
     * return null.
     * @static
     * @param {string} fileName File name
     * @returns {string} The mime type of fileName or null if not found.
     * @memberof Utils
     */
    static getMimeType(fileName: string): string {
        if (!fileName) {
            return null;
        }

        const match = FILE_COMPLIANT_REGEX.exec(fileName);
        if (!match) {
            throw new Error(`The file ${fileName} is not a compliant file name.`);
        }

        switch (match[2].toLowerCase()) {
            case '.txt': return MIMETYPE_TXT;
            case '.docx': return MIMETYPE_DOCX;
            case '.xlsx': return MIMETYPE_XLSX;
            case '.pdf': return MIMETYPE_PDF;
            default: return null;
        }
    }

    /**
 * Get the corresponding extension for the specified mimeType.
 * @static
 * @param {string} mimeType The mime type
 * @returns {string} The extension for the specified mimeType.
 * @memberof Utils
 */
    static getMimeTypeExtension(mimeType: string): string {
        if (!mimeType) {
            return '';
        }

        switch (mimeType) {
            case MIMETYPE_TXT: return '.txt';
            case MIMETYPE_DOCX: return '.docx';
            case MIMETYPE_XLSX: return '.xlsx';
            case MIMETYPE_PDF: return '.pdf';
            default: return '';
        }
    }

    /**
     * Try to get a property value from an object case insensitively.
     * @static
     * @param {*} obj Object that should contains value.
     * @param {*} prop Name of property.
     * @returns Value or undefined if not found.
     * @memberof Utils
     */
    static getPropertyCI(obj: object, property: string): object {
        const foundProperty = Object.keys(obj).find(k => k.toLowerCase() === property.toLowerCase());
        if (foundProperty) {
            return obj[foundProperty];
        }
        return undefined;
    }

    /**
     * Check if an object is not null or (for string) empty.
     * @private
     * @param {*} object
     * @returns {boolean} True if null or empty; otherwise false.
     * @memberof ConfigService
     */
    static isNullOrEmpty(object: any): boolean {
        if (!object) {
            return true;
        }
        if (typeof object === 'string') {
            return object.trim() === '';
        }

        return false;
    }

}
