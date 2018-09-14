/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Injectable } from '@angular/core';

/**
 * Current date service provider. It seems stupid,
 * but this allow to mock date in tests.
 * @export
 * @class DateProviderService
 */
@Injectable({
    providedIn: 'root'
})
export class DateProviderService {

    constructor() { }

    /**
     * Returns the current date and time. It seems stupid,
     * but this allow to mock date in tests.
     * @returns {Date} The current date and time.
     * @memberof DateProviderService
     */
    now(): Date {
        return new Date();
    }

}
