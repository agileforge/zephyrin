/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Injectable } from '@angular/core';
import { MailModel } from '../mail-sender/mailModel';
import { InvalidEmailAddressError } from '../mailer-engine/invalidEmailAddressError';
import { Observable, empty, merge } from 'rxjs';
import { ConfigModel } from '../config/configModel';
import { MailingDataModel } from '../mailer-engine/mailingDataModel';
import { FileService } from '../file/file.service';
import * as dateFormat from 'dateformat';
import { LogService } from '../log-service';
import { DateProviderService } from '../date-provider/date-provider.service';
import { FILEDATE_FORMAT } from '../../misc/const';

/**
 * Service to log mails when sent.
 * @export
 * @class MailingLoggerService
 */
@Injectable({
    providedIn: 'root'
})
export class MailingLoggerService {

    constructor(
        private _logger: LogService,
        private _fileService: FileService,
        private _dateProvider: DateProviderService
    ) { }

    /**
     * Saves the initial value of a mailing process.
     * @param {ConfigModel} config
     * @param {MailingDataModel} mailingData
     * @memberof MailingLoggerService
     */
    initial(config: ConfigModel, mailingData: MailingDataModel): Observable<void> {
        // Create log directory
        let directoryPath = config.mailingLog.directoryPath || this._fileService.pathJoin(__dirname, 'logs');
        const sessionName = dateFormat(this._dateProvider.now(), FILEDATE_FORMAT);

        if (mailingData.name) {
            directoryPath = this._fileService.pathJoin(directoryPath, mailingData.name, sessionName);
        } else {
            directoryPath = this._fileService.pathJoin(directoryPath, sessionName);
        }
        this._fileService.makeDir(directoryPath);

        // Build file names
        const configFileName = this._fileService.pathJoin(directoryPath, 'config.json');
        const dataFileName = this._fileService.pathJoin(directoryPath, 'mailing.json');
        const templateFileName = this._fileService.pathJoin(directoryPath, mailingData.template.fileName);
        const datasourceFileName = this._fileService.pathJoin(
            directoryPath, this._fileService.pathExtractFileName(mailingData.datasource.fileName));

        // Get mailing data without template.
        const template = mailingData.template;
        const data = mailingData.datasource.data;
        delete mailingData.template;
        delete mailingData.datasource.data;
        const dataJson = JSON.stringify(mailingData, null, 2);
        mailingData.datasource.data = data;
        mailingData.template = template;

        // Save it all
        return merge(
            this._fileService.writeText(configFileName, JSON.stringify(config, null, 2)),
            this._fileService.writeText(dataFileName, dataJson),
            this._fileService.writeBytes(templateFileName, mailingData.template.content),
            this._fileService.copyFile(mailingData.datasource.fileName, datasourceFileName)
        );
    }

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
