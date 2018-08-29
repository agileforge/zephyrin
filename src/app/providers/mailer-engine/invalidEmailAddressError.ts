/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { MergeableRowDataModel } from '../data-loader/mergeableRowDataModel';

/**
 * Error thrown when an email address is null or invalid.
 * @export
 * @class InvalidEmailAddressError
 * @extends {Error}
 */
export class InvalidEmailAddressError extends Error {

    /**
     * The email that cause the error.
     * @type { string }
     * @memberof InvalidEmailAddressError
     */
    emailAddress: string;
    /**
     * The row that cause the error.
     * @type {{ [field: string]: string }}
     * @memberof InvalidEmailAddressError
     */
    row: MergeableRowDataModel;
    /**
     * The field name that must contains the email address value.
     * @type {string}
     * @memberof InvalidEmailAddressError
     */
    emailField: string;
    /**
     * The row number in the data table that cause the error.
     * @type {number}
     * @memberof InvalidEmailAddressError
     */
    rowNum: number;

    /**
     * Creates an instance of InvalidEmailAddressError.
     * @param {string} emailAddress The address that cause the error. undefined and null are handled.
     * @param {string} emailField The row that cause the error.
     * @param {*} row The row of data where should be the mail.
     * @param {number} rowNum The row number in the data table that cause the error.
     * @memberof InvalidEmailAddressError
     */
    constructor(emailAddress: string, emailField: string, row: MergeableRowDataModel, rowNum: number) {
        let message: string;
        if (typeof emailAddress === 'undefined') {
            message = `The field '${emailField}' not found in row at line ${rowNum}.`;
        } else if (emailAddress === null) {
            message = `The email address is null at line ${rowNum}.`;
        } else {
            message = `The email address '${emailAddress}' at line ${rowNum} is not valid.`;
        }

        super(message);

        this.emailAddress = emailAddress;
        this.emailField = emailField;
        this.row = row;
        this.rowNum = rowNum;
    }

}
