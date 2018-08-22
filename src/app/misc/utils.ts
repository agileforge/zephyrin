import { FILE_COMPLIANT_REGEX, MIMETYPE_TXT, MIMETYPE_DOCX, MIMETYPE_XLSX, MIMETYPE_PDF } from "./const";

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

}
