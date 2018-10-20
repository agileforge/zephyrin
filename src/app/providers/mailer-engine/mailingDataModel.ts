/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DocumentModel } from '../document/documentModel';
import { MailingDataSource } from './mailingDataSource';

/**
 * Represents all information to be able to make a mailing.
 * @export
 * @interface MailingDataModel
 */
export interface MailingDataModel {

    /**
     * The mailing name. Useful to identify the mailing in logs.
     * @type {string}
     * @memberof MailingDataModel
     */
    name?: string;
    /**
     * Provide a list of email addresses that will recieve copy of sent emails.
     * This list is a string separated by ",", ";" or "|" char.
     * @type {string}
     * @memberof MailingDataModel
     */
    copyToAddresses: string;
    /**
     * Provide a list of email addresses that will recieve a blind copy of sent emails.
     * This list is a string separated by ",", ";" or "|" char.
     * Data source placeholders can also be used.
     * @type {string}
     * @memberof MailingDataModel
     */
    blindCopyToAddresses: string;
    /**
     * The subject of the mail.
     *
     * This value can contains placeholders as '{field_name}' that will
     * be replaced with data found in the data array in datasource.
     * Data source placeholders can also be used.
     * @type {string}
     * @memberof MailingData
     */
    subject: string;
    /**
     * The body of email. It could be HTML code.
     *
     * This value can contains placeholders as '{field_name}' that will
     * be replaced with data found in the data array in datasource.
     * @type {string}
     * @memberof MailingData
     */
    body: string;
    /**
     * A document that will be a template to generate an attachment for each
     * sent mails.
     *
     * The template document can contains placeholders as '{field_name}' that will
     * be replaced with data found in the data array in datasource.
     * @type {DocumentModel}
     * @memberof MailingData
     */
    template: DocumentModel;
    /**
     * The mime type of rendered document after merging from template and datasource
     * to be attached in mail.
     * @type {string}
     * @memberof MailingData
     */
    renderType: string;
    /**
     * Data that will be used to generate emails. It contains a data table
     * where each row will be an email.
     * @type {MailingDataSource}
     * @memberof MailingData
     */
    datasource: MailingDataSource;
}

