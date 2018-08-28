/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Injectable } from '@angular/core';
import { MailModel } from '../mail-sender/mailModel';
import { InvalidEmailAddressError } from '../mailer-engine/invalidEmailAddressError';
import { Observable, empty } from 'rxjs';

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
     * @param {string} mail The mail data that fail while sending.
     * @param {number} rowNum The row number of data table.
     * @memberof MailingLoggerService
     */
    success(mail: MailModel, rowNum: number): Observable<void> {
        return empty();
    }

    /**
     * @param {MailModel} mail The mail that fail.
     * @memberof MailingLoggerService
     */
    /**
     * Log a mail that has fail when sending.
     * @param {MailModel} mail The mail data that fail while sending.
     * @param {Error} error The error that cause the mail sending fail.
     * @param {number} rowNum The row number of data table.
     * @memberof MailingLoggerService
     */
    sendFail(mail: MailModel, error: Error, rowNum: number): Observable<void> {
        return empty();
    }

    /**
     * Log an email address error.
     * @param {MailModel} mail The mail that fail.
     * @memberof MailingLoggerService
     */
    emailAddressError(error: InvalidEmailAddressError): Observable<void> {
        return empty();
    }

}
