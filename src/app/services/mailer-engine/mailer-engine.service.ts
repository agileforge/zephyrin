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

/**
 * Service that is able to merge and then send email with attachement
 * from template and a table datasource.
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
     * @param {MailSenderService} _mailSenderService
     * @memberof MailerEngineService
     */
    constructor(
        private _configService: ConfigService,
        private _mailSenderService: MailSenderService,
        private _mailingLoggerServiced: MailingLoggerService
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

        mailingDataSource.datasource.data
            .filter(row => EMAIL_REGEX.test(row['email']))
            .forEach(row => {
                const mail = <MailModel>{
                    from: Utils.getEmailAddress(config.sender.emailAddress, config.sender.fullName),
                    to: [Utils.getEmailAddress(row[emailField], row[lastNameField], row[firstNameField])],
                    subject: that.replaceFields(mailingDataSource.subject, row),
                    body: that.replaceFields(mailingDataSource.body, row),
                    attachments: []
                };

                that._mailSenderService.send(mail).subscribe(() => {
                    that._mailingLoggerServiced.success(mail);
                }, err => {
                    that._mailingLoggerServiced.fail(mail);
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
