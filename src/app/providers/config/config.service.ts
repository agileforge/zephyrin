/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Injectable } from '@angular/core';
import { ConfigModel } from './configModel';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { FileService } from '../file/file.service';

/**
 * Provides user configuration services.
 * @export
 * @class ConfigServiceService
 */
@Injectable({
    providedIn: 'root'
})
export class ConfigService {

    config = new BehaviorSubject(<ConfigModel>{});

    /**
     *Creates an instance of ConfigServiceService.
     * @memberof ConfigService
     */
    constructor(private _fileService: FileService) { }

    /**
     * Saves the configuration.
     * @returns {Observable<ConfigModel>}
     * @memberof ConfigService
     */
    save(): Observable<void> {
        const fileName = this._fileService.pathJoin(__dirname, 'config.json');
        const text = JSON.stringify(this.config.value, null, 2);
        return this._fileService.writeText(text, fileName);
    }

    /**
     * Saves the configuration.
     * @returns {Observable<ConfigModel>}
     * @memberof ConfigService
     */
    load(): Observable<ConfigModel> {
        // TODO: Implements
        throw new Error('Not implemented');
    }

}
