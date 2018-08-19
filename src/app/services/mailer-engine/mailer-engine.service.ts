/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Injectable } from '@angular/core';
import { MailSenderService } from '../mail-sender/mail-sender.service';
import { MailingData } from './mailingData';

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

    /**
     *Creates an instance of MailerEngineService.
     * @param {MailSenderService} _mailSenderService
     * @memberof MailerEngineService
     */
    constructor(
        private _mailSenderService: MailSenderService
    ) { }

    /**
     * Merge, prepare document and send email to each address found
     * in mailingDataSource.data.
     * @param {MailingDataSource} mailingDataSource
     * @memberof MailerEngineService
     */
    sendMails(mailingDataSource: MailingData) {
        throw new Error('Not implemented');
    }

}
