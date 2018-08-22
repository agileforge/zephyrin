/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Injectable } from '@angular/core';
import { MailSenderService } from '../mail-sender/mail-sender.service';
import { MailingData } from './mailingData';
import { MailModel } from '../mail-sender/mailModel';
import { EMAIL_REGEX } from '../../misc/const';
import { ConfigService } from '../config/config.service';
import Utils from '../../misc/utils';
import { MailingLoggerService } from '../mailing-logger/mailing-logger.service';
import { InvalidEmailAddressError } from './invalidEmailAddressError';
import { DocumentMergerService } from '../render-engine/document-merger/document-merger.service';

/**
 * Service that is able to merge and then send email with attachment
 * from template and a table data source.
 * @export
 * @class MailerEngineService
 */
@Injectable({
    providedIn: 'root'
})
export class MailerEngineService {

    private _placeHolderPattern = /(\{([\w\d_\-\.]*)\})/ig;

    /**
     *Creates an instance of MailerEngineService.
     * @memberof MailerEngineService
     */
    constructor(
        private _configService: ConfigService,
        private _mailSenderService: MailSenderService,
        private _mailingLoggerService: MailingLoggerService,
        private _documentMergerService: DocumentMergerService
    ) {
    }

    /**
     * Merge, prepare document and send email to each address found
     * in mailingDataSource.data.
     * @param {MailingDataSource} mailingDataSource
     * @memberof MailerEngineService
     */
    sendMails(mailingDataSource: MailingData) {
        const that = this;
        const config = this._configService.config.value;

        const emailField = mailingDataSource.datasource.mailAddressField;
        const lastNameField = mailingDataSource.datasource.lastNameField;
        const firstNameField = mailingDataSource.datasource.firstNameField;
        const template = mailingDataSource.template;
        const renderType = mailingDataSource.renderType;

        let rowNum = 0;
        mailingDataSource.datasource.data
            .forEach(row => {
                rowNum++;

                const emailAddress = row[emailField];
                // Check if email is valid
                if (!EMAIL_REGEX.test(emailAddress)) {
                    const error = new InvalidEmailAddressError(emailAddress, emailField, row, rowNum);
                    that._mailingLoggerService.emailAddressError(error);
                    return;
                }

                // Email address is valid, prepare data
                const mail = <MailModel>{
                    from: Utils.getEmailAddress(config.sender.emailAddress, config.sender.fullName),
                    to: [Utils.getEmailAddress(emailAddress, row[lastNameField], row[firstNameField])],
                    subject: that.replaceFields(mailingDataSource.subject, row),
                    body: that.replaceFields(mailingDataSource.body, row),
                    attachments: []
                };

                // Eventually merge and render the attached document.
                if (template) {
                    const renderedDocument = that._documentMergerService.mergeAndRender(row, template, renderType);
                    mail.attachments.push(renderedDocument.content);
                }

                // Send the email
                that._mailSenderService.send(mail).subscribe(() => {
                    that._mailingLoggerService.success(mail, rowNum);
                }, err => {
                    that._mailingLoggerService.sendFail(mail, err, rowNum);
                });
            });
    }

    /**
     * Replace placeholders in form {field_name} by found value in data.
     * If a placeholder is not found in data, leave it as is.
     * @private
     * @param {string} value The string that contains place holders.
     * @param {{ [field: string]: string }} data The dictionary that contains data.
     * @memberof MailerEngineService
     */
    private replaceFields(value: string, data: { [field: string]: string }): string {
        return value.replace(this._placeHolderPattern, (match, $1, $2) => {
            return data[$2] || $1; // If field not exists in data let it as is.
        });
    }

}
