/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { MailingDataSource } from './mailingDataSource';

/**
 * Represents all informations to be able to make a mailing.
 * @export
 * @interface MailingData
 */
export interface MailingData {
    /**
     * The subject of the mail.
     *
     * This value can contains placeholders as '{field_name}' that will
     * be replaced with data found in the data array found data mailn
     * @type {string}
     * @memberof MailingData
     */
    subject: string;
    body: string;
    template: string;
    datasource: MailingDataSource;
}

