/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Injectable } from '@angular/core';
import * as dateFormat from 'dateformat';
import { empty, merge, Observable } from 'rxjs';
import { concatMap, filter, map, startWith } from 'rxjs/operators';
import { FILEDATE_FORMAT, ISODATE_FORMAT, MSG_MAILINGDATA_LOADED, MSG_MAILINGLOG_SAVED } from '../../misc/const';
import Utils from '../../misc/utils';
import { ConfigService } from '../config/config.service';
import { DateProviderService } from '../date-provider/date-provider.service';
import { FileService } from '../file/file.service';
import { LogService } from '../log-service';
import { MailModel } from '../mail-sender/mailModel';
import { InvalidEmailAddressError } from '../mailer-engine/invalidEmailAddressError';
import { MailingDataModel } from '../mailer-engine/mailingDataModel';
import { MessageHubService } from '../message-hub.service';

/**
 * Service to log mails when sent.
 * @export
 * @class MailingLoggerService
 */
@Injectable({
    providedIn: 'root'
})
export class MailingLoggerService {

    private _logDirectory: string;

    constructor(
        private _logger: LogService,
        private _config: ConfigService,
        private _fileService: FileService,
        private _messageHub: MessageHubService,
        private _dateProvider: DateProviderService
    ) { }

    /**
     * Saves the initial value of a mailing process.
     * @param {ConfigModel} config
     * @param {MailingDataModel} mailingData
     * @memberof MailingLoggerService
     */
    initial(mailingData: MailingDataModel): Observable<void> {
        const that = this;
        this._logger.debug('Starting to log the initial mailing data...');
        // Get and create log directory
        const directoryPath = this.getDirectory(mailingData.name);

        // Build file names
        const configFileName = this._fileService.pathJoin(directoryPath, 'config.json');
        const dataFileName = this._fileService.pathJoin(directoryPath, 'mailing.json');
        let templateFileName = null;
        const datasourceFileName = this._fileService.pathJoin(
            directoryPath, this._fileService.pathExtractFileName(mailingData.datasource.fileName));
        if (!Utils.isNullOrEmpty(mailingData.template) && !Utils.isNullOrEmpty(mailingData.template.fileName)) {
            templateFileName = this._fileService.pathJoin(directoryPath, mailingData.template.fileName);
        }

        // Get mailing data without template.
        const template = Object.assign({}, mailingData.template);
        const data = mailingData.datasource.data;
        if (mailingData.template) {
            delete mailingData.template.content;
            delete mailingData.template.fileName;
            delete mailingData.template.mimeType;
        }
        delete mailingData.datasource.data;
        const dataJson = JSON.stringify(mailingData, null, 2);
        mailingData.datasource.data = data;
        if (mailingData.template) {
            mailingData.template.content = template.content;
            mailingData.template.fileName = template.fileName;
            mailingData.template.mimeType = template.mimeType;
        }
        this._logger.debug('Mailing data without rows is:', dataJson);

        // Save it all
        return merge(
            this._fileService.writeText(configFileName, JSON.stringify(this._config.config, null, 2)),
            this._fileService.writeText(dataFileName, dataJson),
            templateFileName ? this._fileService.writeBytes(templateFileName, mailingData.template.content) : empty(),
            this._fileService.copyFile(mailingData.datasource.fileName, datasourceFileName)
        ).pipe(
            startWith(that._messageHub.emit(MSG_MAILINGLOG_SAVED))
        );
    }

    /**
     * Log a mail that has been successfully sent.
     * @param {string} mail The mail data that fail while sending.
     * @param {number} rowNum The row number of data table.
     * @memberof MailingLoggerService
     */
    success(mail: MailModel, rowNum: number): Observable<void> {
        const fileName = this._fileService.pathJoin(this._logDirectory, 'success.log');
        const date = dateFormat(this._dateProvider.now(), ISODATE_FORMAT);
        const message = `${date} - From row ${rowNum} sent to "${mail.to[0]}"\n`;
        return this._fileService.appendText(fileName, message);
    }

    /**
     * Log a mail that has fail when sending.
     * @param {MailModel} mail The mail data that fail while sending.
     * @param {Error} error The error that cause the mail sending fail.
     * @param {number} rowNum The row number of data table.
     * @memberof MailingLoggerService
     */
    sendFail(mail: MailModel, error: Error, rowNum: number): Observable<void> {
        const fileName = this._fileService.pathJoin(this._logDirectory, 'error.log');
        const date = dateFormat(this._dateProvider.now(), ISODATE_FORMAT);
        const message = `${date} - From row ${rowNum} fail to send email to "${mail.to[0]}": "${error.message}"\n`;
        return this._fileService.appendText(fileName, message);
    }

    /**
     * Log an email address error.
     * @param {number} rowNum The row number in datasource from where come the error.
     * @param {MailModel} mail The mail that fail.
     * @memberof MailingLoggerService
     */
    emailAddressError(error: InvalidEmailAddressError): Observable<void> {
        const fileName = this._fileService.pathJoin(this._logDirectory, 'bad-address.log');
        const date = dateFormat(this._dateProvider.now(), ISODATE_FORMAT);
        const message = `${date} - ${error.message} It has been taken from field "${error.emailField}" in data source.\n`;
        this._logger.error(`${error.message} It has been taken from field "${error.emailField}" in data source.`)
        return this._fileService.appendText(fileName, message);
    }

    /**
     * Loads an old mailing meta data.
     * @param {string} path Path to directory where are the logs.
     * @returns {Observable<MailingDataModel>} Datamodel that contains metadata.
     * @memberof MailingLoggerService
     */
    load(path: string): void {
        const that = this;
        let lastDir: string = null;
        const result = <MailingDataModel>{};
        this._fileService.getDirectories(path).pipe(
            filter(dirs => dirs.length > 0),
            map(dirs => dirs.sort()[dirs.length - 1]),
            map(dir => {
                // Kee dir for later
                lastDir = that._fileService.pathJoin(path, dir);
                // Loads config
                const configFileName = that._fileService.pathJoin(lastDir, 'config.json');
                if (that._fileService.fileExists(configFileName)) {
                    that._config.load(configFileName).subscribe();
                }
                return dir;
            }),
            concatMap(dir => {
                // Loads meta data
                const metaFileName = that._fileService.pathJoin(lastDir, 'mailing.json');
                if (that._fileService.fileExists(metaFileName)) {
                    return that._fileService.readText(metaFileName);
                }
            }),
            // Then return the loaded data
            map(data => Object.assign(result, JSON.parse(data)))
        ).subscribe(data => {
            this._messageHub.emitMessage(MSG_MAILINGDATA_LOADED, {
                logPath: lastDir,
                mailingData: data
            });
        });
    }

    /**
     * Build log directory and ensure it exists.
     * @private
     * @param {string} mailingName Name of mailing
     * @returns {string}
     * @memberof MailingLoggerService
     */
    private getDirectory(mailingName: string): string {
        let directoryPath =
            this._config.config.mailingLog.directoryPath ||
            this._fileService.pathJoin(this._fileService.currentDir, 'logs');
        const sessionName = dateFormat(this._dateProvider.now(), FILEDATE_FORMAT);

        if (mailingName) {
            directoryPath = this._fileService.pathJoin(directoryPath, mailingName, sessionName);
        } else {
            directoryPath = this._fileService.pathJoin(directoryPath, sessionName);
        }
        this._fileService.makeDir(directoryPath);

        this._logDirectory = directoryPath;
        return directoryPath;
    }

}
