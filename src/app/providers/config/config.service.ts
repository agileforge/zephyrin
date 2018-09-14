/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import Utils from '../../misc/utils';
import { FileService } from '../file/file.service';
import { LogService } from '../log-service';
import { ConfigModel } from './configModel';

/**
 * Provides user configuration services.
 * @export
 * @class ConfigServiceService
 */
@Injectable({
    providedIn: 'root'
})
export class ConfigService {

    config: ConfigModel;
    configSubject = new ReplaySubject<ConfigModel>();

    private _fileName: string;

    /**
     *Creates an instance of ConfigServiceService.
     * @memberof ConfigService
     */
    constructor(
        private _logger: LogService,
        private _fileService: FileService,
    ) {
        this.config = <ConfigModel>{
            mailingLog: {
                directoryPath: this._fileService.pathJoin(this._fileService.currentDir, 'logs'),
            },
        };

        this._fileName = this._fileService.pathJoin(this._fileService.currentDir, 'config.json');
    }

    /**
     * Saves the configuration.
     * @returns {Observable<ConfigModel>}
     * @memberof ConfigService
     */
    save(): Observable<void> {
        this._logger.debug(`Saving config to file '${this._fileName}'.`);
        const text = JSON.stringify(this.config, null, 2);
        const result = this._fileService.writeText(this._fileName, text);
        this._logger.info(`File '${this._fileName}' successfully saved.`);
        return result;
    }

    /**
     * Saves the configuration.
     * @returns {Observable<ConfigModel>}
     * @memberof ConfigService
     */
    load(): Observable<ConfigModel> {
        this._logger.debug(`Loading config from file '${this._fileName}'.`);
        const that = this;
        return this._fileService.readText(this._fileName).pipe(
            map(t => {
                that.config = <ConfigModel>JSON.parse(t);
                this._logger.info(`Config successfully loaded from file '${this._fileName}':\n${t}.`);
                this.configSubject.next(this.config);
                return that.config;
            })
        );
    }

    /**
     * Check if config is complient and ready.
     * @returns {boolean} True id complient and ready; oterwise false.
     * @memberof ConfigService
     */
    checkConfig(): boolean {
        const cfg = this.config;
        const ine = Utils.isNullOrEmpty;

        return !ine(cfg) &&
            !ine(cfg.sender) &&
            !ine(cfg.sender.emailAddress) &&
            !ine(cfg.smtp) &&
            !ine(cfg.smtp.host) &&
            !ine(cfg.smtp.userName);
    }

}
