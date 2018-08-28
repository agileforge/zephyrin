/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
* Represents the source of data where mails mus be sended. The data value can
* be compared to table. Each row of array is a dictionary of key/value where
* key is the field name and value the value of field in current row.
*
* Also the mailAddressField property serve to find the fundamental value to
* be able to send an email.
* lastNameField and firstNameField also serve to build email address, but are not
* fundamental (required).
* @export
* @interface MailingDataSource
*/
export interface MailingDataSource {
    /**
     * Filed name to find the email address in data array.
     * @type {string}
     * @memberof MailingDataSource
     */
    mailAddressField: string;
    /**
     * Filed name to find the last name in data array.
     * In the array, the value of this field can also contains a full name.
     * @type {string}
     * @memberof MailingDataSource
     */
    lastNameField?: string;
    /**
     * Filed name to find the first name in data array.
     * @type {string}
     * @memberof MailingDataSource
     */
    firstNameField?: string;
    /**
     * Array of key value pair (field/value) that represents the data table
     * used to do the mailing.
     * @type {{
     *         [field: string]: string;
     *     }[]}
     * @memberof MailingDataSource
     */
    data: {
        [field: string]: string;
    }[];
}
