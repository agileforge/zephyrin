/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Injectable } from '@angular/core';
import { ConfigModel } from './configModel';
import { Observable, ReplaySubject, BehaviorSubject } from 'rxjs';

/**
 * Provides user configuration services.
 * @export
 * @class ConfigServiceService
 */
@Injectable({
    providedIn: 'root'
})
export class ConfigServiceService {

    config = new BehaviorSubject(<ConfigModel>{});

    /**
     *Creates an instance of ConfigServiceService.
     * @memberof ConfigServiceService
     */
    constructor() { }

    /**
     * Saves the configuration.
     * @returns {Observable<ConfigModel>}
     * @memberof ConfigServiceService
     */
    save(): Observable<ConfigModel> {
        throw new Error('Not implemented');
    }

    /**
     * Saves the configuration.
     * @returns {Observable<ConfigModel>}
     * @memberof ConfigServiceService
     */
    load(): Observable<ConfigModel> {
        throw new Error('Not implemented');
    }

}
