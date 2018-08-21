/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Injectable } from '@angular/core';
import { MailModel } from '../mail-sender/mailModel';

/**
 * Service to log mails when sent.
 * @export
 * @class MailingLoggerService
 */
@Injectable({
    providedIn: 'root'
})
export class MailingLoggerService {

    /**
     *Creates an instance of MailingLoggerService.
     * @memberof MailingLoggerService
     */
    constructor() { }

    /**
     * Log a mail that has been successfully sent.
     * @param {MailModel} mail The sent mail.
     * @memberof MailingLoggerService
     */
    success(mail: MailModel) {
    }

    /**
     * Log a mail that has fail when sending.
     * @param {MailModel} mail The mail that fail.
     * @memberof MailingLoggerService
     */
    fail(mail: MailModel) {
    }

}
