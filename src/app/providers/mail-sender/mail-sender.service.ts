/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Injectable } from '@angular/core';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';
import { Attachment } from 'nodemailer/lib/mailer';
import { Observable } from 'rxjs';
import Utils from '../../misc/utils';
import { ConfigService } from '../config/config.service';
import { ConfigModel } from '../config/configModel';
import { LogService } from '../log-service';
import { MailModel } from './mailModel';

/**
 * Service that provide facilities to send emails.
 * @export
 * @class MailSenderService
 */
@Injectable({
    providedIn: 'root'
})
export class MailSenderService {

    private _config: ConfigModel;
    private _transporter: Transporter;

    /**
     *Creates an instance of MailSenderService.
     * @memberof MailSenderService
     */
    constructor(
        private _logger: LogService,
        private _configService: ConfigService
    ) {
        this._config = this._configService.config;
    }

    /**
     * If necessary initializes the class.
     * @private
     * @memberof MailSenderService
     */
    private initialize(): void {
        if (this._transporter) {
            return;
        }

        // Create reusable transporter object using the default SMTP transport
        this._transporter = nodemailer.createTransport({
            host: this._config.smtp.host,
            port: this._config.smtp.port,
            secure: this._config.smtp.isSsl,
            auth: {
                user: this._config.smtp.userName,
                pass: this._config.smtp.password
            }
        });
    }

    /**
     * Send an email according {@link #mail} data.
     * @param {MailModel} mail
     * @memberof MailSenderService
     */
    send(mail: MailModel): Observable<void> {
        const that = this;
        this.initialize();

        // Setup email data with unicode symbols
        const mailOptions: MailOptions = {
            from: Utils.getEmailAddress(this._config.sender.emailAddress, this._config.sender.fullName),
            to: mail.to.join(','),
            cc: mail.cc ? mail.cc.join(',') : null,
            bcc: mail.cci ? mail.cci.join(',') : null,
            subject: mail.subject,
            html: mail.body,
            attachments: mail.attachments.map(a => <Attachment>{
                filename: a.fileName || Utils.getMimeType,
                content: new Buffer(a.content),
                contentType: a.mimeType
            })
        };

        return Observable.create(observer => {
            // Send mail with defined transport object
            that._transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    that._logger.error(`Mail to '${mailOptions.to}' has not been sent:\n${error.message}`, error);
                    observer.error(error);
                    return;
                }
                that._logger.info(`Mail successfully sent to '${mailOptions.to}'.`);
                observer.next();
                observer.complete();
            });
        });
    }

}
