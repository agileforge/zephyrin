/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Injectable } from '@angular/core';
import { ConfigModel } from './configModel';
import { Observable } from 'rxjs';
import { FileService } from '../file/file.service';
import { LogService } from '../log-service';
import { map } from 'rxjs/operators';

/**
 * Provides user configuration services.
 * @export
 * @class ConfigServiceService
 */
@Injectable({
    providedIn: 'root'
})
export class ConfigService {

    config = <ConfigModel>{
        mailingLog: {
            directoryPath: this._fileService.pathJoin(__dirname, 'logs'),
        },
    };

    private _fileName = this._fileService.pathJoin(__dirname, 'config.json');

    /**
     *Creates an instance of ConfigServiceService.
     * @memberof ConfigService
     */
    constructor(
        private _logger: LogService,
        private _fileService: FileService
    ) { }

    /**
     * Saves the configuration.
     * @returns {Observable<ConfigModel>}
     * @memberof ConfigService
     */
     save(): Observable<void> {
        this._logger.debug(`Saving config to file '${this._fileName}'.`);
        const text = JSON.stringify(this.config, null, 2);
        const result = this._fileService.writeText(text, this._fileName);
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
                return that.config;
            })
        );
    }

}
