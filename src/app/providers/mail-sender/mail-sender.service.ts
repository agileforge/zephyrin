/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Injectable } from '@angular/core';
import { MailModel } from './mailModel';
import { Observable } from 'rxjs';


/**
 * Service that provide facilities to send emails.
 * @export
 * @class MailSenderService
 */
@Injectable({
    providedIn: 'root'
})
export class MailSenderService {

    /**
     *Creates an instance of MailSenderService.
     * @memberof MailSenderService
     */
    constructor() { }

    /**
     * Send an email according {@link #mail} data.
     * @param {MailModel} mail
     * @memberof MailSenderService
     */
    send(mail: MailModel): Observable<void> {
        // TODO: Implements
        console.log(mail);
        throw new Error('Not implemented');
    }

}
