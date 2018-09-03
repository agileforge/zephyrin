/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { EventEmitter, Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { EMAIL_REGEX } from '../../misc/const';
import Utils from '../../misc/utils';
import { ConfigService } from '../config/config.service';
import { MergeableRowDataModel } from '../data-loader/mergeableRowDataModel';
import { DocumentModel } from '../document/documentModel';
import { MailSenderService } from '../mail-sender/mail-sender.service';
import { MailModel } from '../mail-sender/mailModel';
import { MailingLoggerService } from '../mailing-logger/mailing-logger.service';
import { DocumentMergerService } from '../render-engine/document-merger/document-merger.service';
import { InvalidEmailAddressError } from './invalidEmailAddressError';
import { MailingDataModel } from './mailingDataModel';

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

    progress = new EventEmitter<{ count: number, total: number, percent: number }>();

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
    sendMails(mailingDataSource: MailingDataModel): Observable<void> {
        const that = this;
        const config = this._configService.config;

        const emailField = mailingDataSource.datasource.mailAddressField;
        const lastNameField = mailingDataSource.datasource.lastNameField;
        const firstNameField = mailingDataSource.datasource.firstNameField;
        const template = mailingDataSource.template;
        const renderType = mailingDataSource.renderType;

        // Initialize the mailing log
        that._mailingLoggerService.initial(mailingDataSource).subscribe();

        // And send it all
        let rowCounter = 0;
        const rowTotal = mailingDataSource.datasource.data.length;
        return from(mailingDataSource.datasource.data)
            .pipe(
                map(row => <{ rowNum: number, row: MergeableRowDataModel }>{ rowNum: ++rowCounter, row }),
                mergeMap(irow => {
                    const rowNum = irow.rowNum;
                    const row = irow.row;

                    const emailAddress = this.getValueAsString(row, emailField);
                    const lastName = this.getValueAsString(row, lastNameField);
                    const firstName = this.getValueAsString(row, firstNameField);
                    // Check if email is valid
                    if (!EMAIL_REGEX.test(emailAddress)) {
                        const error = new InvalidEmailAddressError(emailAddress, emailField, row, rowNum);
                        that._mailingLoggerService.emailAddressError(error);
                        return;
                    }

                    // Email address is valid, prepare data
                    const mail = <MailModel>{
                        from: Utils.getEmailAddress(config.sender.emailAddress, config.sender.fullName),
                        to: [Utils.getEmailAddress(emailAddress, lastName, firstName)],
                        subject: that.replaceFields(mailingDataSource.subject, row),
                        body: that.replaceFields(mailingDataSource.body, row),
                        attachments: []
                    };

                    // Eventually merge and render the attached document.
                    let merger = of(<DocumentModel>{ mimeType: renderType, content: null });
                    if (template) {
                        merger = that._documentMergerService.mergeAndRender(row, template, renderType);
                    }

                    // Send the email
                    return merger.pipe(map(document => {
                        if (document.content) {
                            mail.attachments.push(document);
                        }
                        that._mailSenderService.send(mail).pipe(map(() => {
                            this.progress.emit({
                                count: rowNum,
                                total: rowTotal,
                                percent: rowNum / rowTotal * 100
                            });

                            that._mailingLoggerService.success(mail, rowNum).subscribe();
                        }, err => {
                            that._mailingLoggerService.sendFail(mail, err, rowNum).subscribe();
                        }));
                    }));
                }, 1),
            );
    }

    /**
     * Get the value of the specified fieldName in row as string.
     * If value is undefined or null, return it as is.
     * @private
     * @param {MergeableRowDataModel} row Data where search field.
     * @param {string} fieldName Field to search.
     * @returns {string} Result or null or undefined.
     * @memberof MailerEngineService
     */
    private getValueAsString(row: MergeableRowDataModel, fieldName: string): any {
        const value = row[fieldName];
        if (!value) {
            return value;
        }
        return value.toString();
    }

    /**
     * Replace placeholders in form {field_name} by found value in data.
     * If a placeholder is not found in data, leave it as is.
     * @private
     * @param {string} value The string that contains place holders.
     * @param {{ [field: string]: string }} data The dictionary that contains data.
     * @memberof MailerEngineService
     */
    private replaceFields(value: string, data: MergeableRowDataModel): string {
        return value.replace(this._placeHolderPattern, (match, $1, $2) => {
            return data[$2] || $1; // If field not exists in data let it as is.
        });
    }

}
