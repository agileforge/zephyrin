/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { MergeableRowDataModel } from '../data-loader/mergeableRowDataModel';

/**
* Represents the source of data where mails must be sent. The data value can
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
     * If data source comes from a file, store the file name here.
     * @type {string}
     * @memberof MailingDataSource
     */
    fileName?: string;
    /**
     * Array of key value pair (field/value) that represents the data table
     * used to do the mailing.
     * @type {MergeableRowDataModel[]}
     * @memberof MailingDataSource
     */
    data: MergeableRowDataModel[];
}
