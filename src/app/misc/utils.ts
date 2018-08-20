/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Provides usefull miscelanous functions.
*/
export default class Utils {

    /**
     * Builds email address as "Full Name <my.email@somedomain.com>" respecting RFC specifications.
     * @param {string} address The email address.
     * @param {string} lastOrFullName Last nome or directly the full name.
     * @param {string} firstName The first name.
     */
    static getEmailAddress(address: string, lastOrFullName?: string, firstName?: string) {
        const fullName = `${(firstName || '').trim()} ${(lastOrFullName || '').trim()}`.trim();
        address = address.trim();
        if (fullName === '') {
            return address;
        }
        return `${fullName} <${address}>`;
    }

}
